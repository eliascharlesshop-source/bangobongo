import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { getDatabase } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'user' | 'admin'
  walletAddress?: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Get user from token
export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = verifyToken(token)
  if (!payload) return null

  const db = getDatabase()
  const user = db.prepare(`
    SELECT id, email, first_name, last_name, role, wallet_address
    FROM users 
    WHERE id = ?
  `).get(payload.userId) as any

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    walletAddress: user.wallet_address
  }
}

// Extract token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Also check cookies
  const token = request.cookies.get('auth-token')?.value
  return token || null
}

// Middleware to authenticate requests
export async function authenticateRequest(request: NextRequest): Promise<User | null> {
  const token = getTokenFromRequest(request)
  if (!token) return null

  return getUserFromToken(token)
}

// Middleware to require authentication
export async function requireAuth(request: NextRequest): Promise<User> {
  const user = await authenticateRequest(request)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

// Middleware to require admin role
export async function requireAdmin(request: NextRequest): Promise<User> {
  const user = await requireAuth(request)
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }
  return user
}

// Create user
export async function createUser(userData: {
  email: string
  password: string
  firstName?: string
  lastName?: string
  walletAddress?: string
}): Promise<User> {
  const db = getDatabase()
  const { v4: uuidv4 } = require('uuid')

  // Check if user already exists
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(userData.email)
  if (existingUser) {
    throw new Error('User already exists')
  }

  const userId = uuidv4()
  const hashedPassword = await hashPassword(userData.password)

  db.prepare(`
    INSERT INTO users (id, email, password_hash, first_name, last_name, wallet_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    userData.email,
    hashedPassword,
    userData.firstName || null,
    userData.lastName || null,
    userData.walletAddress || null
  )

  return {
    id: userId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: 'user',
    walletAddress: userData.walletAddress
  }
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const db = getDatabase()

  const user = db.prepare(`
    SELECT id, email, password_hash, first_name, last_name, role, wallet_address
    FROM users 
    WHERE email = ?
  `).get(email) as any

  if (!user) return null

  const isValidPassword = await verifyPassword(password, user.password_hash)
  if (!isValidPassword) return null

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    walletAddress: user.wallet_address
  }
}