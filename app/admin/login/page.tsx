'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    twoFactorCode: ''
  })
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Set secure cookies
      document.cookie = `admin-token=${data.token}; path=/; max-age=3600; secure; samesite=strict; httponly`
      document.cookie = `admin-session=${data.sessionData}; path=/; max-age=3600; secure; samesite=strict; httponly`
      
      router.push(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-purple-200">Secure access to music generation platform</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Sign In</CardTitle>
            <CardDescription className="text-purple-200">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="bangobongo.ece@gmail.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-purple-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-purple-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twoFactorCode" className="text-white">2FA Code (Optional)</Label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={loginData.twoFactorCode}
                  onChange={(e) => setLoginData(prev => ({ ...prev, twoFactorCode: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                  maxLength={6}
                />
              </div>

              {error && (
                <Alert className="bg-red-500/20 border-red-500/50">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <p className="text-sm text-purple-200 mb-3">Security Features</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
                    <Shield className="h-3 w-3 mr-1" />
                    JWT Auth
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
                    <Lock className="h-3 w-3 mr-1" />
                    Role-based Access
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
                    <Eye className="h-3 w-3 mr-1" />
                    Session Encryption
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-purple-200 text-sm">
            Powered by Next.js with secure middleware protection
          </p>
        </div>
      </div>
    </div>
  )
}
