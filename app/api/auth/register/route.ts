import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createUser, generateToken } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  walletAddress: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }
    
    const { email, password, firstName, lastName, walletAddress } = validation.data
    
    // Create user
    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
      walletAddress
    })
    
    // Generate token
    const token = generateToken(user)
    
    // Create response with token in cookie
    const response = successResponse({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        walletAddress: user.walletAddress
      },
      token
    }, 'User registered successfully')
    
    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
    
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.message === 'User already exists') {
      return errorResponse('User already exists', 409)
    }
    
    return errorResponse('Registration failed', 500)
  }
}