import { z } from 'zod'

// Music generation validation schemas
export const MusicGenerationSchema = z.object({
  genre: z.string().min(1, 'Genre is required').max(50, 'Genre too long'),
  style: z.string().min(1, 'Style is required').max(50, 'Style too long'),
  mood: z.string().min(1, 'Mood is required').max(30, 'Mood too long'),
  tempo: z.string().min(1, 'Tempo is required'),
  instruments: z.array(z.string().min(1).max(30)).min(1, 'At least one instrument required'),
  customDescription: z.string().max(1000, 'Description too long').optional(),
  duration: z.string().regex(/^\d{1,2}:\d{2}$/, 'Duration must be in MM:SS format'),
  key: z.string().min(1, 'Key is required').max(20, 'Key too long')
})

export const LyricsGenerationSchema = z.object({
  manualLyrics: z.string().max(5000, 'Lyrics too long').optional(),
  theme: z.string().min(1, 'Theme is required').max(30, 'Theme too long'),
  style: z.string().min(1, 'Style is required').max(30, 'Style too long'),
  rhymeScheme: z.enum(['AABB', 'ABAB', 'ABCA', 'Free Verse']),
  syllableCount: z.enum(['6', '8', '10', '12', 'Variable']),
  autoGenerate: z.boolean().default(false)
})

export const AdminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  twoFactorCode: z.string().regex(/^\d{6}$/, '2FA code must be 6 digits').optional()
})

// Input sanitization functions
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove potential JavaScript
    .replace(/on\w+=/gi, '') // Remove potential event handlers
    .slice(0, 10000) // Limit length
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateMusicData(data: unknown) {
  try {
    return MusicGenerationSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

export function validateLyricsData(data: unknown) {
  try {
    return LyricsGenerationSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

export function validateLoginData(data: unknown) {
  try {
    return AdminLoginSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

// Rate limiting validation
export function validateRateLimit(ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const key = `rate_limit_${ip}`
  
  // In production, use Redis or database
  const store = new Map<string, { count: number; resetTime: number }>()
  
  const record = store.get(key)
  
  if (!record || now > record.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= maxRequests) {
    return false
  }
  
  record.count++
  return true
}

// File upload validation
export function validateFileUpload(file: File): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac']
  
  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB')
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type must be MP3, WAV, OGG, or FLAC')
  }
  
  // Check filename for suspicious patterns
  if (/[<>:"|?*]/.test(file.name)) {
    errors.push('Filename contains invalid characters')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// SQL injection prevention
export function sanitizeSqlInput(input: string): string {
  return input
    .replace(/['"\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/;/g, '') // Remove semicolons
    .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b/gi, '')
}

// XSS prevention
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Content Security Policy validation
export function validateCSP(input: string): boolean {
  const dangerousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /<script/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ]
  
  return !dangerousPatterns.some(pattern => pattern.test(input))
}
