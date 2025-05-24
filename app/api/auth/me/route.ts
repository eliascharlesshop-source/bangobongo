import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { successResponse, unauthorizedResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        walletAddress: user.walletAddress
      }
    })
    
  } catch (error: any) {
    console.error('Get user error:', error)
    return unauthorizedResponse()
  }
}