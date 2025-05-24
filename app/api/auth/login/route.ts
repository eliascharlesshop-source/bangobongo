import { NextRequest } from 'next/server'
import { z } from 'zod'
import { authenticateUser, generateToken } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }
    
    const { email, password } = validation.data
    
    // Authenticate user
    const user = await authenticateUser(email, password)
    if (!user) {
      return errorResponse('Invalid email or password', 401)
    }
    
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
    }, 'Login successful')
    
    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
    
  } catch (error: any) {
    console.error('Login error:', error)
    return errorResponse('Login failed', 500)
  }
}