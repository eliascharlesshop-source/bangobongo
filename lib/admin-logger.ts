import { createHash, randomBytes } from 'crypto'

export interface AdminLogEntry {
  id: string
  timestamp: string
  userId: string
  userEmail: string
  action: string
  resource: string
  details: Record<string, any>
  ip: string
  userAgent: string
  sessionId: string
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  success: boolean
  duration?: number
}

class AdminLogger {
  private logs: AdminLogEntry[] = []
  private readonly maxLogs = 10000 // Keep last 10k logs in memory
  private readonly logFile = 'admin-actions.log'

  private generateLogId(): string {
    return randomBytes(16).toString('hex')
  }

  private hashSensitiveData(data: string): string {
    return createHash('sha256').update(data).digest('hex').substring(0, 8)
  }

  private sanitizeLogData(data: Record<string, any>): Record<string, any> {
    const sanitized = { ...data }
    
    // Remove or hash sensitive fields
    if (sanitized.password) {
      sanitized.password = '[REDACTED]'
    }
    if (sanitized.email) {
      sanitized.email = this.hashSensitiveData(sanitized.email) + '@***'
    }
    if (sanitized.token) {
      sanitized.token = '[REDACTED]'
    }
    if (sanitized.sessionData) {
      sanitized.sessionData = '[REDACTED]'
    }
    
    return sanitized
  }

  log(entry: Omit<AdminLogEntry, 'id' | 'timestamp'>): void {
    const logEntry: AdminLogEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      ...entry,
      details: this.sanitizeLogData(entry.details)
    }

    this.logs.push(logEntry)

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // In production, write to secure log file or logging service
    this.writeToLog(logEntry)
  }

  private writeToLog(entry: AdminLogEntry): void {
    const logLine = JSON.stringify(entry)
    console.log(`[ADMIN-ACTION] ${logLine}`)
    
    // In production, you would:
    // 1. Write to a secure, append-only log file
    // 2. Send to a centralized logging service (ELK, Splunk, etc.)
    // 3. Set up log rotation and retention policies
    // 4. Ensure logs are written to a different server/storage
  }

  // Specific logging methods for common admin actions
  logLogin(userId: string, userEmail: string, ip: string, userAgent: string, sessionId: string, success: boolean, duration?: number): void {
    this.log({
      userId,
      userEmail,
      action: 'LOGIN',
      resource: 'auth',
      details: { success },
      ip,
      userAgent,
      sessionId,
      level: success ? 'INFO' : 'WARNING',
      success,
      duration
    })
  }

  logLogout(userId: string, userEmail: string, ip: string, userAgent: string, sessionId: string): void {
    this.log({
      userId,
      userEmail,
      action: 'LOGOUT',
      resource: 'auth',
      details: {},
      ip,
      userAgent,
      sessionId,
      level: 'INFO',
      success: true
    })
  }

  logMusicGeneration(userId: string, userEmail: string, musicData: any, ip: string, userAgent: string, sessionId: string, success: boolean, duration?: number): void {
    this.log({
      userId,
      userEmail,
      action: 'MUSIC_GENERATION',
      resource: 'music',
      details: { 
        genre: musicData.genre,
        style: musicData.style,
        mood: musicData.mood,
        instruments: musicData.instruments?.length || 0
      },
      ip,
      userAgent,
      sessionId,
      level: success ? 'INFO' : 'ERROR',
      success,
      duration
    })
  }

  logLyricsGeneration(userId: string, userEmail: string, lyricsData: any, ip: string, userAgent: string, sessionId: string, success: boolean, duration?: number): void {
    this.log({
      userId,
      userEmail,
      action: 'LYRICS_GENERATION',
      resource: 'lyrics',
      details: { 
        theme: lyricsData.theme,
        style: lyricsData.style,
        rhymeScheme: lyricsData.rhymeScheme,
        autoGenerate: lyricsData.autoGenerate
      },
      ip,
      userAgent,
      sessionId,
      level: success ? 'INFO' : 'ERROR',
      success,
      duration
    })
  }

  logUnauthorizedAccess(ip: string, userAgent: string, path: string, reason: string): void {
    this.log({
      userId: 'anonymous',
      userEmail: 'anonymous',
      action: 'UNAUTHORIZED_ACCESS',
      resource: path,
      details: { reason },
      ip,
      userAgent,
      sessionId: 'none',
      level: 'WARNING',
      success: false
    })
  }

  logSuspiciousActivity(userId: string, userEmail: string, ip: string, userAgent: string, sessionId: string, activity: string, details: Record<string, any>): void {
    this.log({
      userId,
      userEmail,
      action: 'SUSPICIOUS_ACTIVITY',
      resource: 'security',
      details: { activity, ...details },
      ip,
      userAgent,
      sessionId,
      level: 'WARNING',
      success: false
    })
  }

  logSystemError(error: Error, context: Record<string, any>): void {
    this.log({
      userId: 'system',
      userEmail: 'system',
      action: 'SYSTEM_ERROR',
      resource: context.resource || 'unknown',
      details: { 
        error: error.message,
        stack: error.stack,
        ...context
      },
      ip: 'system',
      userAgent: 'system',
      sessionId: 'system',
      level: 'ERROR',
      success: false
    })
  }

  // Query methods for analytics and monitoring
  getLogsByUser(userId: string, limit: number = 100): AdminLogEntry[] {
    return this.logs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  getLogsByAction(action: string, limit: number = 100): AdminLogEntry[] {
    return this.logs
      .filter(log => log.action === action)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  getLogsByTimeRange(startDate: Date, endDate: Date): AdminLogEntry[] {
    const startTime = startDate.getTime()
    const endTime = endDate.getTime()
    
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime()
      return logTime >= startTime && logTime <= endTime
    })
  }

  getFailedLogins(limit: number = 50): AdminLogEntry[] {
    return this.logs
      .filter(log => log.action === 'LOGIN' && !log.success)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  getSecurityEvents(limit: number = 100): AdminLogEntry[] {
    return this.logs
      .filter(log => log.level === 'WARNING' || log.level === 'CRITICAL')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  // Analytics methods
  getActionStats(timeRange?: { start: Date; end: Date }): Record<string, number> {
    const relevantLogs = timeRange 
      ? this.getLogsByTimeRange(timeRange.start, timeRange.end)
      : this.logs

    return relevantLogs.reduce((stats, log) => {
      stats[log.action] = (stats[log.action] || 0) + 1
      return stats
    }, {} as Record<string, number>)
  }

  getUserActivityStats(timeRange?: { start: Date; end: Date }): Record<string, number> {
    const relevantLogs = timeRange 
      ? this.getLogsByTimeRange(timeRange.start, timeRange.end)
      : this.logs

    return relevantLogs.reduce((stats, log) => {
      if (log.userId !== 'system' && log.userId !== 'anonymous') {
        stats[log.userId] = (stats[log.userId] || 0) + 1
      }
      return stats
    }, {} as Record<string, number>)
  }

  getErrorRate(timeRange?: { start: Date; end: Date }): number {
    const relevantLogs = timeRange 
      ? this.getLogsByTimeRange(timeRange.start, timeRange.end)
      : this.logs

    const totalLogs = relevantLogs.length
    const errorLogs = relevantLogs.filter(log => !log.success).length

    return totalLogs > 0 ? (errorLogs / totalLogs) * 100 : 0
  }

  // Export logs for backup or analysis
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = 'ID,Timestamp,User,Action,Resource,Level,Success,IP,UserAgent\n'
      const rows = this.logs.map(log => 
        `${log.id},${log.timestamp},${log.userId},${log.action},${log.resource},${log.level},${log.success},${log.ip},${log.userAgent}`
      ).join('\n')
      return headers + rows
    }

    return JSON.stringify(this.logs, null, 2)
  }

  // Clear old logs (for maintenance)
  clearOldLogs(olderThanDays: number): number {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)
    
    const initialCount = this.logs.length
    this.logs = this.logs.filter(log => new Date(log.timestamp) >= cutoffDate)
    
    return initialCount - this.logs.length
  }
}

// Singleton instance
export const adminLogger = new AdminLogger()

// Middleware helper for automatic logging
export function createLogMiddleware(logger: AdminLogger) {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now()
    const originalSend = res.send

    res.send = function(body: any) {
      const duration = Date.now() - startTime
      const userId = req.user?.id || 'anonymous'
      const userEmail = req.user?.email || 'anonymous'
      
      if (req.path.startsWith('/admin')) {
        logger.log({
          userId,
          userEmail,
          action: req.method,
          resource: req.path,
          details: { statusCode: res.statusCode },
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          sessionId: req.session?.id || 'none',
          level: res.statusCode >= 400 ? 'ERROR' : 'INFO',
          success: res.statusCode < 400,
          duration
        })
      }

      originalSend.call(this, body)
    }

    next()
  }
}
