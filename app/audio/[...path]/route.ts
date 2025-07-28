import { NextRequest, NextResponse } from 'next/server'

// Serve a simple audio tone for testing
export async function GET(request: NextRequest) {
  try {
    // Generate a simple audio buffer or redirect to a known working audio source
    const audioUrl = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBT2Y2u7GdSRcbOftwH4xBSB4yuDYgEEPC06i5feycB8Gul/A7K9dF2VRozePPUwYGHKl6rNUGAU0fpfz0YMpBi2z2+LFcCkOK3+m5LlUGwQxW3L28sKFNhMZUJLm45B7LwQ4gNXvxnomQ3SFj+mHWQs6M2C35MpNMC1zNHhUl7YnQVQJN6yb6N2cVcHG18aLPjxSyUGtZLrZk3WqjfHtJoAJ7DJyeJShSR0JwHGFjy3IA9i52VoWdJtNTWd0FH6q61KdQ+IiMl4wKkLGaLJZe2t6qVFIrPJZ/f4X'

    return NextResponse.redirect(audioUrl)
  } catch (error) {
    return new NextResponse('Audio not found', { status: 404 })
  }
}
