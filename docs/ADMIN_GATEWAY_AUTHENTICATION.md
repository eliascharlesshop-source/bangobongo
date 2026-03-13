# Admin Gateway Authentication System Documentation

## Overview

The Admin Gateway Authentication System provides comprehensive security for the music generation platform's admin panel. It implements multi-layered protection including JWT-based authentication, role-based access control, session encryption, rate limiting, and comprehensive audit logging.

## Architecture

### Components

1. **Middleware Layer** (`middleware.ts`)
   - Request interception and validation
   - JWT token verification
   - Role-based access control
   - Rate limiting
   - Security headers injection

2. **Authentication API** (`app/api/admin/auth/login/route.ts`)
   - User credential validation
   - JWT token generation
   - Session creation and encryption
   - Two-factor authentication support

3. **Admin Logger** (`lib/admin-logger.ts`)
   - Comprehensive action logging
   - Security event tracking
   - Analytics and reporting
   - Log export capabilities

4. **Validation Layer** (`lib/validation.ts`)
   - Input sanitization
   - Schema validation
   - XSS and SQL injection prevention
   - File upload validation

## Security Features

### 1. Authentication & Authorization

#### JWT Token Structure
```json
{
  "userId": "string",
  "email": "string", 
  "role": "super_admin|admin|moderator",
  "sessionId": "string",
  "iat": "timestamp",
  "exp": "timestamp"
}
```

#### Role Hierarchy
- **Super Admin**: Full system access
- **Admin**: User management, settings, music generation
- **Moderator**: Music and lyrics management only

#### Route Protection
```typescript
// Route-based role mapping
const routeRoleMap: Record<string, AdminRole> = {
  '/admin/super': ADMIN_ROLES.SUPER_ADMIN,
  '/admin/users': ADMIN_ROLES.ADMIN,
  '/admin/settings': ADMIN_ROLES.ADMIN,
  '/admin/music': ADMIN_ROLES.MODERATOR,
  '/admin/lyrics': ADMIN_ROLES.MODERATOR
}
```

### 2. Session Management

#### Session Encryption
- Sessions are encrypted before storage
- Uses AES-256 encryption (configurable)
- Contains user context and security metadata

#### Session Data Structure
```typescript
{
  sessionId: string,
  userId: string,
  loginTime: string,
  userAgent: string,
  ip: string
}
```

#### Security Features
- Secure, HTTP-only cookies
- 1-hour session timeout
- Automatic session invalidation on logout
- Cross-site request forgery (CSRF) protection

### 3. Rate Limiting

#### Configuration
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Storage**: In-memory (production: Redis)

#### Implementation
```typescript
function rateCheck(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const maxRequests = 100
  
  // Rate limiting logic
}
```

### 4. Input Validation & Sanitization

#### Validation Schemas
- Zod-based schema validation
- Type safety and runtime validation
- Comprehensive error messages

#### Security Measures
- XSS prevention
- SQL injection protection
- HTML tag sanitization
- File upload validation
- Content Security Policy validation

### 5. Audit Logging

#### Logged Events
- Login attempts (success/failure)
- Logout events
- Music generation actions
- Lyrics generation actions
- Unauthorized access attempts
- Suspicious activities
- System errors

#### Log Structure
```typescript
{
  id: string,
  timestamp: string,
  userId: string,
  userEmail: string,
  action: string,
  resource: string,
  details: Record<string, any>,
  ip: string,
  userAgent: string,
  sessionId: string,
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL',
  success: boolean,
  duration?: number
}
```

## Implementation Guide

### 1. Setup

#### Environment Variables
```bash
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SESSION_ENCRYPTION_KEY=your-32-char-encryption-key-here
```

#### Database Setup
```sql
-- Users table
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  two_factor_secret TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Sessions table (for production)
CREATE TABLE admin_sessions (
  session_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES admin_users(id)
);
```

### 2. Middleware Configuration

#### Basic Setup
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // Rate limiting
  if (!rateCheck(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // JWT verification
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    return NextResponse.redirect('/admin/login')
  }

  // Role-based access control
  if (!hasRequiredRole(userRole, requiredRole)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  return NextResponse.next()
}
```

#### Route Matcher
```typescript
export const config = {
  matcher: ['/admin/:path*']
}
```

### 3. API Integration

#### Login Endpoint
```typescript
export async function POST(request: NextRequest) {
  const { email, password, twoFactorCode } = await request.json()
  
  // Validate input
  const validatedData = validateLoginData({ email, password, twoFactorCode })
  
  // Authenticate user
  const user = await authenticateUser(validatedData.email, validatedData.password)
  
  // Generate JWT
  const token = jwt.sign(tokenPayload, JWT_SECRET)
  
  // Create encrypted session
  const sessionData = encryptSessionData(sessionPayload)
  
  return NextResponse.json({ token, sessionData, user })
}
```

### 4. Frontend Integration

#### Login Component
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const response = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
  })
  
  const { token, sessionData } = await response.json()
  
  // Set secure cookies
  document.cookie = `admin-token=${token}; path=/; max-age=3600; secure; samesite=strict; httponly`
  document.cookie = `admin-session=${sessionData}; path=/; max-age=3600; secure; samesite=strict; httponly`
  
  router.push('/admin/dashboard')
}
```

## Security Best Practices

### 1. Production Deployment

#### Environment Security
- Use strong, randomly generated secrets
- Rotate secrets regularly
- Use environment-specific configurations
- Enable HTTPS everywhere

#### Database Security
- Use connection encryption
- Implement database-level access controls
- Regular security audits
- Backup encryption

#### Infrastructure Security
- Web Application Firewall (WAF)
- DDoS protection
- Intrusion detection systems
- Regular security patches

### 2. Monitoring & Alerting

#### Security Events to Monitor
- Failed login attempts (>5 per minute)
- Unauthorized access attempts
- Suspicious user behavior
- Anomalous API usage patterns

#### Alert Configuration
```typescript
// Example alert conditions
const securityAlerts = {
  multipleFailedLogins: (logs) => logs.filter(log => 
    log.action === 'LOGIN' && !log.success
  ).length > 5,
  suspiciousIPActivity: (logs) => {
    const ipCounts = logs.reduce((counts, log) => {
      counts[log.ip] = (counts[log.ip] || 0) + 1
      return counts
    }, {})
    return Object.values(ipCounts).some(count => count > 100)
  }
}
```

### 3. Compliance

#### Data Protection
- GDPR compliance for EU users
- CCPA compliance for California users
- Data retention policies
- Right to deletion implementation

#### Audit Requirements
- Immutable audit logs
- Regular audit reports
- Access control documentation
- Security incident response plans

## Troubleshooting

### Common Issues

#### 1. Token Expiration
**Problem**: Users getting logged out frequently
**Solution**: 
- Check JWT expiration time
- Verify system time synchronization
- Implement token refresh mechanism

#### 2. Rate Limiting Issues
**Problem**: Legitimate users being rate limited
**Solution**:
- Adjust rate limits based on usage patterns
- Implement IP whitelisting for trusted sources
- Use sliding window rate limiting

#### 3. Session Issues
**Problem**: Sessions not persisting
**Solution**:
- Check cookie configuration
- Verify domain and path settings
- Ensure HTTPS in production

### Debug Mode

#### Enable Debug Logging
```typescript
// Add to middleware.ts
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('[MIDDLEWARE] Request details:', {
    path: pathname,
    ip,
    userAgent,
    hasToken: !!token
  })
}
```

#### Security Headers Verification
```bash
# Check security headers
curl -I https://your-domain.com/admin/dashboard
```

## API Reference

### Authentication Endpoints

#### POST /api/admin/auth/login
**Description**: Authenticate admin user
**Body**: 
```json
{
  "email": "string",
  "password": "string",
  "twoFactorCode": "string (optional)"
}
```
**Response**:
```json
{
  "success": true,
  "token": "string",
  "sessionData": "string",
  "user": {
    "id": "string",
    "email": "string", 
    "role": "string"
  }
}
```

#### POST /api/admin/auth/logout
**Description**: Logout admin user
**Headers**: `Authorization: Bearer <token>`
**Response**: `{ "success": true }`

#### GET /api/admin/auth/verify
**Description**: Verify token validity
**Headers**: `Authorization: Bearer <token>`
**Response**: 
```json
{
  "valid": true,
  "user": {
    "id": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Logging Endpoints

#### GET /api/admin/logs
**Description**: Retrieve admin logs
**Query Parameters**:
- `userId`: Filter by user ID
- `action`: Filter by action type
- `startDate`: ISO date string
- `endDate`: ISO date string
- `limit`: Number of logs to return

**Response**:
```json
{
  "logs": [AdminLogEntry[]],
  "total": number,
  "hasMore": boolean
}
```

## Maintenance

### Regular Tasks

1. **Daily**
   - Review security logs
   - Monitor failed login attempts
   - Check system performance

2. **Weekly**
   - Rotate secrets (if configured)
   - Review access patterns
   - Update security patches

3. **Monthly**
   - Audit user permissions
   - Review log retention policies
   - Security assessment

### Backup & Recovery

#### Log Backup
```bash
# Export logs for backup
curl -X GET "https://your-domain.com/api/admin/logs/export?format=json" \
  -H "Authorization: Bearer <token>" \
  > admin-logs-backup-$(date +%Y%m%d).json
```

#### Disaster Recovery
1. Restore from encrypted backups
2. Reset all user sessions
3. Force password resets
4. Review audit logs for compromise indicators

## Support

For security issues or questions about the authentication system:
- Review the troubleshooting section
- Check the debug logs
- Contact the security team for critical issues
- Follow the incident response plan for security events

---

**Last Updated**: 2026-03-12
**Version**: 1.0.0
**Security Classification**: Confidential
