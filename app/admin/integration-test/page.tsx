'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Globe, 
  ShoppingCart,
  Music,
  Settings
} from 'lucide-react'

interface TestResult {
  service: string
  status: 'success' | 'error' | 'testing'
  message: string
  details?: any
}

export default function IntegrationTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    dittoApiKey: '',
    dittoApiSecret: '',
    shopifyDomain: '',
    shopifyStorefrontToken: '',
    shopifyAdminToken: ''
  })

  const updateResult = (service: string, status: TestResult['status'], message: string, details?: any) => {
    setTestResults(prev => {
      const filtered = prev.filter(r => r.service !== service)
      return [...filtered, { service, status, message, details }]
    })
  }

  const testDittoConnection = async () => {
    updateResult('Ditto Music', 'testing', 'Testing connection...')
    
    try {
      // Test authentication
      const response = await fetch('/api/ditto/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: credentials.dittoApiKey,
          apiSecret: credentials.dittoApiSecret
        })
      })

      const data = await response.json()
      
      if (data.success) {
        updateResult('Ditto Music', 'success', 'Connected successfully!', data)
      } else {
        updateResult('Ditto Music', 'error', data.error || 'Connection failed')
      }
    } catch (error) {
      updateResult('Ditto Music', 'error', `Connection error: ${error}`)
    }
  }

  const testShopifyConnection = async () => {
    updateResult('Shopify Storefront', 'testing', 'Testing storefront access...')
    updateResult('Shopify Admin', 'testing', 'Testing admin access...')
    
    try {
      // Test Shopify connection
      const response = await fetch('/api/shopify/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: credentials.shopifyDomain,
          storefrontToken: credentials.shopifyStorefrontToken,
          adminToken: credentials.shopifyAdminToken
        })
      })

      const data = await response.json()
      
      if (data.success) {
        updateResult('Shopify Storefront', 'success', 'Storefront API working!', data.storefront)
        updateResult('Shopify Admin', 'success', 'Admin API working!', data.admin)
      } else {
        updateResult('Shopify Storefront', 'error', data.storefrontError || 'Storefront connection failed')
        updateResult('Shopify Admin', 'error', data.adminError || 'Admin connection failed')
      }
    } catch (error) {
      updateResult('Shopify Storefront', 'error', `Connection error: ${error}`)
      updateResult('Shopify Admin', 'error', `Connection error: ${error}`)
    }
  }

  const testFullIntegration = async () => {
    setLoading(true)
    
    // Test all services
    await testDittoConnection()
    await testShopifyConnection()
    
    // Test end-to-end workflow
    updateResult('Integration', 'testing', 'Testing complete workflow...')
    
    try {
      const response = await fetch('/api/test/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()
      
      if (data.success) {
        updateResult('Integration', 'success', 'End-to-end integration working!')
      } else {
        updateResult('Integration', 'error', data.error || 'Integration test failed')
      }
    } catch (error) {
      updateResult('Integration', 'error', `Integration error: ${error}`)
    }
    
    setLoading(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'testing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      testing: 'secondary'
    }
    return <Badge variant={variants[status] as any}>{status.toUpperCase()}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Integration Tester</h1>
        <p className="text-muted-foreground">
          Test your Ditto Music and Shopify API connections
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Credentials Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Credentials
            </CardTitle>
            <CardDescription>
              Enter your API credentials to test connections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Music className="w-4 h-4" />
                Ditto Music API
              </h3>
              <div>
                <Label>API Key (Client ID)</Label>
                <Input
                  value={credentials.dittoApiKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, dittoApiKey: e.target.value }))}
                  placeholder="your-ditto-client-id"
                />
              </div>
              <div>
                <Label>API Secret</Label>
                <Input
                  type="password"
                  value={credentials.dittoApiSecret}
                  onChange={(e) => setCredentials(prev => ({ ...prev, dittoApiSecret: e.target.value }))}
                  placeholder="your-ditto-client-secret"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Shopify API
              </h3>
              <div>
                <Label>Store Domain</Label>
                <Input
                  value={credentials.shopifyDomain}
                  onChange={(e) => setCredentials(prev => ({ ...prev, shopifyDomain: e.target.value }))}
                  placeholder="your-store.myshopify.com"
                />
              </div>
              <div>
                <Label>Storefront Access Token</Label>
                <Input
                  value={credentials.shopifyStorefrontToken}
                  onChange={(e) => setCredentials(prev => ({ ...prev, shopifyStorefrontToken: e.target.value }))}
                  placeholder="shpat_..."
                />
              </div>
              <div>
                <Label>Admin Access Token</Label>
                <Input
                  value={credentials.shopifyAdminToken}
                  onChange={(e) => setCredentials(prev => ({ ...prev, shopifyAdminToken: e.target.value }))}
                  placeholder="shpat_..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={testDittoConnection} variant="outline" className="flex-1">
                Test Ditto
              </Button>
              <Button onClick={testShopifyConnection} variant="outline" className="flex-1">
                Test Shopify
              </Button>
            </div>

            <Button 
              onClick={testFullIntegration} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Full Integration'}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Connection status for each service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.length === 0 ? (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    No tests run yet. Enter your credentials and click "Test Full Integration"
                  </AlertDescription>
                </Alert>
              ) : (
                testResults.map((result) => (
                  <div key={result.service} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h4 className="font-medium">{result.service}</h4>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                ))
              )}
            </div>

            {testResults.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Next Steps:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {testResults.every(r => r.status === 'success') ? (
                    <>
                      <li>✅ All integrations working!</li>
                      <li>✅ Ready to upload tracks and sync products</li>
                      <li>✅ Customers can purchase beats and merchandise</li>
                    </>
                  ) : (
                    <>
                      <li>🔧 Fix any failed connections above</li>
                      <li>📖 Check the setup guides for help</li>
                      <li>💬 Contact support if issues persist</li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Music className="w-4 h-4" />
                Ditto Music Setup
              </h3>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Sign up at dittomusic.com</li>
                <li>2. Complete verification process</li>
                <li>3. Access Developer/API section</li>
                <li>4. Generate Client ID and Secret</li>
                <li>5. Note your Artist/Label ID</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Shopify App Setup
              </h3>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Go to Shopify Admin → Settings → Apps</li>
                <li>2. Click "Develop apps for your store"</li>
                <li>3. Create app "BangoBongo Integration"</li>
                <li>4. Configure API scopes (see docs)</li>
                <li>5. Install app and copy tokens</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
