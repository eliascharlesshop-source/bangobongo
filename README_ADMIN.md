# Music Generation Platform - Admin Panel

A secure, comprehensive admin panel for music generation with AI-powered features, role-based access control, and advanced security measures.

## 🚀 Features

### 🔐 Security & Authentication
- **JWT-based Authentication** with encrypted sessions
- **Role-Based Access Control** (Super Admin, Admin, Moderator)
- **Two-Factor Authentication** support
- **Rate Limiting** and DDoS protection
- **Comprehensive Audit Logging**
- **Input Validation** and XSS/SQL injection prevention

### 🎵 Music Generation
- **Genre & Style Selection** with 8 major music categories
- **Intelligent Autofill** suggestions based on user input
- **Mood & Tempo Configuration**
- **Multi-instrument Support** with visual selection
- **Custom Duration & Key Settings**
- **Real-time Generation Progress**

### 🎤 Lyrics Management
- **Manual Lyrics Input** with rich text editing
- **AI-Powered Lyrics Generation**
- **Rhyming Word Suggestions**
- **Syllable Counting** for rhythm alignment
- **Verse Structure Templates**
- **Theme & Style Configuration**

### 📊 Analytics & Monitoring
- **Generation Statistics** and usage metrics
- **User Activity Tracking**
- **Performance Monitoring**
- **Security Event Dashboard**
- **Export Capabilities**

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: Radix UI, Tailwind CSS, Lucide Icons
- **Security**: JWT, bcryptjs, crypto, Zod validation
- **Styling**: Tailwind CSS with custom themes
- **State Management**: React hooks and context

## 📁 Project Structure

```
├── app/
│   ├── admin/
│   │   ├── login/                    # Admin login page
│   │   ├── dashboard/                # Main admin dashboard
│   │   └── api/auth/                 # Authentication API
│   └── api/                          # API routes
├── lib/
│   ├── validation.ts                 # Input validation schemas
│   └── admin-logger.ts              # Audit logging system
├── middleware.ts                     # Security middleware
├── docs/
│   └── ADMIN_GATEWAY_AUTHENTICATION.md
└── README_ADMIN.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL or SQLite (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bangobongo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   
   # Configure these variables
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   SESSION_ENCRYPTION_KEY=your-32-char-encryption-key-here
   DATABASE_URL=your-database-connection-string
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the admin panel**
   - Navigate to `http://localhost:3000/admin/login`
   - Default credentials:
     - **Email:** bangobongo.ece@gmail.com
     - Password: `admin123`

## 🔧 Configuration

### Authentication Settings

Edit `middleware.ts` to configure:

```typescript
// Role hierarchy
const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', 
  MODERATOR: 'moderator'
}

// Rate limiting
const windowMs = 15 * 60 * 1000 // 15 minutes
const maxRequests = 100 // requests per window
```

### Music Generation Settings

Configure music options in `app/admin/dashboard/page.tsx`:

```typescript
// Add new genres
const musicGenres = [
  { value: 'electronic', label: 'Electronic', styles: ['House', 'Techno'] },
  // Add your custom genres here
]
```

### Validation Rules

Update validation schemas in `lib/validation.ts`:

```typescript
export const MusicGenerationSchema = z.object({
  genre: z.string().min(1).max(50),
  // Customize validation rules
})
```

## 🔐 Security Features

### Authentication Flow

1. **Login Request** → Validation → JWT Generation → Session Creation
2. **Middleware Check** → Token Verification → Role Validation → Route Access
3. **Session Management** → Encryption → Secure Cookies → Timeout Handling

### Security Headers

All admin routes include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` with strict rules

### Audit Logging

Comprehensive logging for:
- Login/logout events
- Music/lyrics generation
- Unauthorized access attempts
- System errors and suspicious activities

## 📱 Usage Guide

### Music Generation

1. **Select Genre & Style**: Choose from dropdown menus
2. **Set Mood & Tempo**: Configure the emotional feel
3. **Choose Instruments**: Click to select multiple instruments
4. **AI Suggestions**: Type descriptions for intelligent autofill
5. **Generate**: Click "Generate Music" with progress tracking

### Lyrics Management

1. **Manual Input**: Type lyrics directly in the text area
2. **AI Generation**: Configure theme, style, and rhyme scheme
3. **Get Assistance**: Use rhyming suggestions and syllable counting
4. **Structure Templates**: Apply verse structure patterns
5. **Real-time Feedback**: Monitor rhyme patterns and rhythm

### Analytics Dashboard

Monitor:
- Total tracks generated
- Active user sessions
- Average generation times
- Security events
- User activity patterns

## 🛡️ Security Best Practices

### Production Deployment

1. **Environment Security**
   ```bash
   # Use strong, randomly generated secrets
   JWT_SECRET=$(openssl rand -base64 32)
   SESSION_ENCRYPTION_KEY=$(openssl rand -hex 32)
   ```

2. **Database Security**
   - Enable SSL connections
   - Use connection pooling
   - Implement database-level access controls

3. **Infrastructure Security**
   - Enable HTTPS everywhere
   - Configure WAF rules
   - Set up monitoring and alerting

### User Management

1. **Role Assignment**
   - Super Admin: Full system access
   - Admin: User management, settings, content generation
   - Moderator: Content management only

2. **Session Security**
   - 1-hour session timeout
   - Automatic logout on inactivity
   - Force logout on security events

## 🔍 Monitoring & Debugging

### Enable Debug Mode

```typescript
// Add to middleware.ts
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('[MIDDLEWARE]', { path, ip, hasToken: !!token })
}
```

### Security Monitoring

Monitor these metrics:
- Failed login attempts per IP
- Unusual API usage patterns
- Session creation frequency
- Error rates and types

### Log Analysis

Export and analyze logs:

```bash
# Export security logs
curl -X GET "/api/admin/logs?action=LOGIN&level=WARNING" \
  -H "Authorization: Bearer <token>"
```

## 🧪 Testing

### Security Testing

1. **Authentication Testing**
   ```bash
   # Test login endpoint
   curl -X POST "/api/admin/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"bangobongo.ece@gmail.com","password":"admin123"}'
   ```

2. **Rate Limiting Testing**
   ```bash
   # Test rate limiting (should return 429)
   for i in {1..101}; do
     curl -X GET "/admin/dashboard"
   done
   ```

### Input Validation Testing

Test validation endpoints with malformed data to ensure proper error handling.

## 📈 Performance Optimization

### Caching Strategy

- **JWT Verification**: Cache verified tokens
- **User Permissions**: Cache role-based access rules
- **Rate Limiting**: Use Redis for distributed rate limiting

### Database Optimization

- **Indexing**: Add indexes on user emails and session IDs
- **Connection Pooling**: Configure appropriate pool sizes
- **Query Optimization**: Use prepared statements

## 🔄 Updates & Maintenance

### Regular Tasks

- **Daily**: Review security logs and failed login attempts
- **Weekly**: Rotate secrets (if configured), update security patches
- **Monthly**: Audit user permissions, review access patterns

### Backup Strategy

- **Database Backups**: Daily encrypted backups
- **Log Backups**: Weekly log exports for long-term storage
- **Configuration Backups**: Version control all configuration files

## 🆘 Troubleshooting

### Common Issues

1. **Token Expiration**: Check JWT expiration time and system time sync
2. **Rate Limiting**: Adjust limits based on legitimate usage patterns
3. **Session Issues**: Verify cookie configuration and HTTPS settings
4. **Permission Errors**: Check role assignments and route mappings

### Debug Commands

```bash
# Check security headers
curl -I "https://your-domain.com/admin/dashboard"

# Test authentication
curl -X GET "/api/admin/auth/verify" \
  -H "Authorization: Bearer <token>"

# View recent logs
npm run logs:recent
```

## 📞 Support

For security issues or questions:
1. Check the troubleshooting section
2. Review the authentication documentation
3. Contact the security team for critical issues
4. Follow the incident response plan

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-12  
**Security Classification**: Confidential
