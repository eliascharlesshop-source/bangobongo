import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = successResponse(null, 'Logout successful')
    
    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    })
    
    return response
    
  } catch (error: any) {
    console.error('Logout error:', error)
    return successResponse(null, 'Logout completed')
  }
}