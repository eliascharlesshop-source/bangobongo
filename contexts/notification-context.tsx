'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { toast } from '@/hooks/use-toast'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  type: NotificationType
  title: string
  description?: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  showSuccess: (title: string, description?: string) => void
  showError: (title: string, description?: string) => void
  showWarning: (title: string, description?: string) => void
  showInfo: (title: string, description?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Use shadcn toast
    toast({
      title: notification.title,
      description: notification.description,
      duration: notification.duration || 5000,
      variant: notification.type === 'error' ? 'destructive' : 'default'
    })

    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, notification.duration || 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const showSuccess = (title: string, description?: string) => {
    showNotification({ type: 'success', title, description })
  }

  const showError = (title: string, description?: string) => {
    showNotification({ type: 'error', title, description })
  }

  const showWarning = (title: string, description?: string) => {
    showNotification({ type: 'warning', title, description })
  }

  const showInfo = (title: string, description?: string) => {
    showNotification({ type: 'info', title, description })
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      removeNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
