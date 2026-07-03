import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Admin role hierarchy
const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
} as const

type AdminRole = typeof ADMIN_ROLES[keyof typeof ADMIN_ROLES]

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Decrypt session data
function decryptSession(encryptedData: string): any {
  try {
    return JSON.parse(Buffer.from(encryptedData, 'base64').toString())
  } catch {
    return null
  }
}

// Rate limiting middleware
function rateCheck(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 100 // max 100 requests per 15 minutes

  const record = rateLimitStore.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

// Basic token validation (without crypto)
function verifyToken(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    // Decode JWT without verification (Edge Runtime compatible)
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' }
    }
    
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString()
    ) as any
    
    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { valid: false, error: 'Token expired' }
    }
    
    return { valid: true, payload }
  } catch (error) {
    return { valid: false, error: 'Token verification failed' }
  }
}

// Check if user has required role
function hasRequiredRole(userRole: AdminRole, requiredRole: AdminRole): boolean {
  const roleHierarchy = {
    [ADMIN_ROLES.SUPER_ADMIN]: 3,
    [ADMIN_ROLES.ADMIN]: 2,
    [ADMIN_ROLES.MODERATOR]: 1
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Log admin actions
function logAdminAction(action: string, userId: string, ip: string, userAgent: string) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    ip,
    userAgent,
    level: 'INFO'
  }
  
  // In production, write to secure log file or logging service
  console.log(`[ADMIN-ACTION] ${JSON.stringify(logEntry)}`)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // Apply rate limiting to all admin routes
  if (pathname.startsWith('/admin')) {
    if (!rateCheck(ip)) {
      logAdminAction('RATE_LIMIT_EXCEEDED', 'unknown', ip, userAgent)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/admin/login', '/admin/auth/verify']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Protect all admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      logAdminAction('UNAUTHORIZED_ACCESS_ATTEMPT', 'unknown', ip, userAgent)
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify JWT token
    const tokenVerification = verifyToken(token)
    
    if (!tokenVerification.valid) {
      logAdminAction('INVALID_TOKEN_ATTEMPT', 'unknown', ip, userAgent)
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin-token')
      response.cookies.delete('admin-session')
      return response
    }

    const { userId, role, sessionId } = tokenVerification.payload

    // Validate session
    const sessionData = request.cookies.get('admin-session')?.value
    if (!sessionData) {
      logAdminAction('MISSING_SESSION', userId, ip, userAgent)
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin-token')
      return response
    }

    const decryptedSession = decryptSession(sessionData)
    if (!decryptedSession || decryptedSession.sessionId !== sessionId) {
      logAdminAction('INVALID_SESSION', userId, ip, userAgent)
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin-token')
      response.cookies.delete('admin-session')
      return response
    }

    // Route-based role checking
    const routeRoleMap: Record<string, AdminRole> = {
      '/admin/super': ADMIN_ROLES.SUPER_ADMIN,
      '/admin/users': ADMIN_ROLES.ADMIN,
      '/admin/settings': ADMIN_ROLES.ADMIN,
      '/admin/music': ADMIN_ROLES.MODERATOR,
      '/admin/lyrics': ADMIN_ROLES.MODERATOR,
      '/admin/analytics': ADMIN_ROLES.MODERATOR
    }

    const requiredRole = Object.entries(routeRoleMap).find(([route]) => 
      pathname.startsWith(route)
    )?.[1]

    if (requiredRole && !hasRequiredRole(role as AdminRole, requiredRole)) {
      logAdminAction('INSUFFICIENT_PERMISSIONS', userId, ip, userAgent)
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Add security headers
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Content-Security-Policy', 
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    )

    // Log successful admin access
    logAdminAction('ADMIN_ACCESS_GRANTED', userId, ip, userAgent)

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
