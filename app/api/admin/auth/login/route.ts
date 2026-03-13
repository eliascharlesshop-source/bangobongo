import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

// Mock user database - in production, use a real database
const users = [
  {
    id: '1',
    email: 'bangobongo.ece@gmail.com',
    password: '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQ', // 'admin123'
    role: 'super_admin',
    twoFactorSecret: 'JBSWY3DPEHPK3PXP' // Mock 2FA secret
  },
  {
    id: '2',
    email: 'bangobongo.ece@gmail.com',
    password: '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQ', // 'admin123'
    role: 'moderator',
    twoFactorSecret: null
  }
]

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

function generateSessionId(): string {
  return randomBytes(32).toString('hex')
}

function encryptSessionData(data: any): string {
  // Simple encoding for demo - in production, use proper encryption
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, twoFactorCode } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify 2FA if enabled
    if (user.twoFactorSecret && !twoFactorCode) {
      return NextResponse.json(
        { error: 'Two-factor authentication code required' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const sessionId = generateSessionId()
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET)
    
    // Create session data
    const sessionData = encryptSessionData({
      sessionId,
      userId: user.id,
      loginTime: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.ip || request.headers.get('x-forwarded-for')
    })

    // Log successful login
    console.log(`[ADMIN-LOGIN] User ${user.email} logged in successfully from ${request.ip}`)

    return NextResponse.json({
      success: true,
      token,
      sessionData,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('[ADMIN-LOGIN-ERROR]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
