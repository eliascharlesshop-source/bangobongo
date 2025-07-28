"use client"

import { useState, useEffect } from "react"
import { 
  Settings, 
  Save, 
  Upload, 
  Eye, 
  EyeOff, 
  Key, 
  Globe, 
  Mail, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Cloud,
  CreditCard,
  Music,
  Store,
  Users,
  BarChart3
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface AdminSettings {
  site: {
    name: string
    description: string
    url: string
    logo: string
    favicon: string
    contactEmail: string
    socialMedia: {
      spotify: string
      instagram: string
      twitter: string
      youtube: string
    }
  }
  music: {
    autoDistribution: boolean
    defaultRoyaltyRate: number
    distributionPartners: string[]
    enableLicensing: boolean
    licenseTypes: string[]
  }
  store: {
    currency: string
    taxRate: number
    shippingEnabled: boolean
    freeShippingThreshold: number
    inventoryTracking: boolean
    lowStockThreshold: number
  }
  users: {
    allowRegistration: boolean
    requireEmailVerification: boolean
    enableVipProgram: boolean
    vipRequirements: {
      minimumSpent: number
      minimumPurchases: number
    }
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    newOrderAlerts: boolean
    lowStockAlerts: boolean
    newUserAlerts: boolean
    distributionAlerts: boolean
  }
  integrations: {
    shopify: {
      enabled: boolean
      apiKey: string
      secretKey: string
    }
    stripe: {
      enabled: boolean
      publicKey: string
      secretKey: string
    }
    ditto: {
      enabled: boolean
      apiKey: string
    }
    analytics: {
      googleAnalytics: string
      facebookPixel: string
    }
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    passwordComplexity: boolean
    ipWhitelist: string[]
  }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Simulate API call - replace with actual settings API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSettings({
        site: {
          name: 'BangoBongo',
          description: 'Electronic music producer and artist platform',
          url: 'https://bangobongo.com',
          logo: '/placeholder-logo.png',
          favicon: '/placeholder-logo.svg',
          contactEmail: 'hello@bangobongo.com',
          socialMedia: {
            spotify: 'https://spotify.com/artist/bangobongo',
            instagram: 'https://instagram.com/bangobongo',
            twitter: 'https://twitter.com/bangobongo',
            youtube: 'https://youtube.com/bangobongo'
          }
        },
        music: {
          autoDistribution: true,
          defaultRoyaltyRate: 70,
          distributionPartners: ['Ditto Music', 'DistroKid', 'CD Baby'],
          enableLicensing: true,
          licenseTypes: ['Basic', 'Premium', 'Exclusive']
        },
        store: {
          currency: 'USD',
          taxRate: 8.5,
          shippingEnabled: true,
          freeShippingThreshold: 50,
          inventoryTracking: true,
          lowStockThreshold: 10
        },
        users: {
          allowRegistration: true,
          requireEmailVerification: true,
          enableVipProgram: true,
          vipRequirements: {
            minimumSpent: 200,
            minimumPurchases: 5
          }
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: false,
          newOrderAlerts: true,
          lowStockAlerts: true,
          newUserAlerts: false,
          distributionAlerts: true
        },
        integrations: {
          shopify: {
            enabled: true,
            apiKey: 'sk_********',
            secretKey: '********'
          },
          stripe: {
            enabled: true,
            publicKey: 'pk_********',
            secretKey: 'sk_********'
          },
          ditto: {
            enabled: true,
            apiKey: 'dt_********'
          },
          analytics: {
            googleAnalytics: 'GA-********',
            facebookPixel: 'FB-********'
          }
        },
        security: {
          twoFactorAuth: true,
          sessionTimeout: 24,
          passwordComplexity: true,
          ipWhitelist: ['192.168.1.1', '10.0.0.1']
        }
      })
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // Simulate API call - replace with actual save endpoint
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Settings saved:', settings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (section: keyof AdminSettings, key: string, value: any) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    })
  }

  const updateNestedSetting = (section: keyof AdminSettings, subsection: string, key: string, value: any) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [subsection]: {
          ...(settings[section] as any)[subsection],
          [key]: value
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Configure your BangoBongo platform</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="site" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="site">Site</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Site Settings */}
        <TabsContent value="site" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Configuration
              </CardTitle>
              <CardDescription>Basic site information and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings?.site.name || ''}
                    onChange={(e) => updateSetting('site', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings?.site.url || ''}
                    onChange={(e) => updateSetting('site', 'url', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings?.site.description || ''}
                  onChange={(e) => updateSetting('site', 'description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings?.site.contactEmail || ''}
                  onChange={(e) => updateSetting('site', 'contactEmail', e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Social Media Links</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="spotify">Spotify</Label>
                    <Input
                      id="spotify"
                      value={settings?.site.socialMedia.spotify || ''}
                      onChange={(e) => updateNestedSetting('site', 'socialMedia', 'spotify', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={settings?.site.socialMedia.instagram || ''}
                      onChange={(e) => updateNestedSetting('site', 'socialMedia', 'instagram', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={settings?.site.socialMedia.twitter || ''}
                      onChange={(e) => updateNestedSetting('site', 'socialMedia', 'twitter', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={settings?.site.socialMedia.youtube || ''}
                      onChange={(e) => updateNestedSetting('site', 'socialMedia', 'youtube', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Music Settings */}
        <TabsContent value="music" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Music Platform Settings
              </CardTitle>
              <CardDescription>Configure music distribution and licensing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto Distribution</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically distribute new tracks to platforms
                  </p>
                </div>
                <Switch
                  checked={settings?.music.autoDistribution || false}
                  onCheckedChange={(checked) => updateSetting('music', 'autoDistribution', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="royaltyRate">Default Royalty Rate (%)</Label>
                <Input
                  id="royaltyRate"
                  type="number"
                  min="0"
                  max="100"
                  value={settings?.music.defaultRoyaltyRate || 0}
                  onChange={(e) => updateSetting('music', 'defaultRoyaltyRate', parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Licensing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow beat licensing and custom licensing options
                  </p>
                </div>
                <Switch
                  checked={settings?.music.enableLicensing || false}
                  onCheckedChange={(checked) => updateSetting('music', 'enableLicensing', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Settings */}
        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Configuration
              </CardTitle>
              <CardDescription>Manage store settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings?.store.currency || 'USD'}
                    onValueChange={(value) => updateSetting('store', 'currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={settings?.store.taxRate || 0}
                    onChange={(e) => updateSetting('store', 'taxRate', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Shipping Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable shipping for physical products
                  </p>
                </div>
                <Switch
                  checked={settings?.store.shippingEnabled || false}
                  onCheckedChange={(checked) => updateSetting('store', 'shippingEnabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="freeShipping">Free Shipping Threshold</Label>
                <Input
                  id="freeShipping"
                  type="number"
                  min="0"
                  value={settings?.store.freeShippingThreshold || 0}
                  onChange={(e) => updateSetting('store', 'freeShippingThreshold', parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Inventory Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track product inventory and stock levels
                  </p>
                </div>
                <Switch
                  checked={settings?.store.inventoryTracking || false}
                  onCheckedChange={(checked) => updateSetting('store', 'inventoryTracking', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowStock">Low Stock Threshold</Label>
                <Input
                  id="lowStock"
                  type="number"
                  min="0"
                  value={settings?.store.lowStockThreshold || 0}
                  onChange={(e) => updateSetting('store', 'lowStockThreshold', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management Settings
              </CardTitle>
              <CardDescription>Configure user registration and VIP program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register accounts
                  </p>
                </div>
                <Switch
                  checked={settings?.users.allowRegistration || false}
                  onCheckedChange={(checked) => updateSetting('users', 'allowRegistration', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Require users to verify their email address
                  </p>
                </div>
                <Switch
                  checked={settings?.users.requireEmailVerification || false}
                  onCheckedChange={(checked) => updateSetting('users', 'requireEmailVerification', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable VIP Program</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically upgrade users to VIP status
                  </p>
                </div>
                <Switch
                  checked={settings?.users.enableVipProgram || false}
                  onCheckedChange={(checked) => updateSetting('users', 'enableVipProgram', checked)}
                />
              </div>

              {settings?.users.enableVipProgram && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minSpent">Minimum Spent ($)</Label>
                    <Input
                      id="minSpent"
                      type="number"
                      min="0"
                      value={settings?.users.vipRequirements.minimumSpent || 0}
                      onChange={(e) => updateNestedSetting('users', 'vipRequirements', 'minimumSpent', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minPurchases">Minimum Purchases</Label>
                    <Input
                      id="minPurchases"
                      type="number"
                      min="0"
                      value={settings?.users.vipRequirements.minimumPurchases || 0}
                      onChange={(e) => updateNestedSetting('users', 'vipRequirements', 'minimumPurchases', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure alert preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings?.notifications.emailNotifications || false}
                  onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>New Order Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new orders are placed
                  </p>
                </div>
                <Switch
                  checked={settings?.notifications.newOrderAlerts || false}
                  onCheckedChange={(checked) => updateSetting('notifications', 'newOrderAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when inventory is low
                  </p>
                </div>
                <Switch
                  checked={settings?.notifications.lowStockAlerts || false}
                  onCheckedChange={(checked) => updateSetting('notifications', 'lowStockAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Distribution Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about music distribution status
                  </p>
                </div>
                <Switch
                  checked={settings?.notifications.distributionAlerts || false}
                  onCheckedChange={(checked) => updateSetting('notifications', 'distributionAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>New User Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new users register
                  </p>
                </div>
                <Switch
                  checked={settings?.notifications.newUserAlerts || false}
                  onCheckedChange={(checked) => updateSetting('notifications', 'newUserAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="space-y-4">
            {/* Shopify Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Shopify Integration
                </CardTitle>
                <CardDescription>Connect your Shopify store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Shopify Integration</Label>
                  <Switch
                    checked={settings?.integrations.shopify.enabled || false}
                    onCheckedChange={(checked) => updateNestedSetting('integrations', 'shopify', 'enabled', checked)}
                  />
                </div>
                
                {settings?.integrations.shopify.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shopifyApi">API Key</Label>
                      <div className="relative">
                        <Input
                          id="shopifyApi"
                          type={showPasswords ? 'text' : 'password'}
                          value={settings?.integrations.shopify.apiKey || ''}
                          onChange={(e) => updateNestedSetting('integrations', 'shopify', 'apiKey', e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shopifySecret">Secret Key</Label>
                      <Input
                        id="shopifySecret"
                        type={showPasswords ? 'text' : 'password'}
                        value={settings?.integrations.shopify.secretKey || ''}
                        onChange={(e) => updateNestedSetting('integrations', 'shopify', 'secretKey', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stripe Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Stripe Payment Integration
                </CardTitle>
                <CardDescription>Configure payment processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Stripe Payments</Label>
                  <Switch
                    checked={settings?.integrations.stripe.enabled || false}
                    onCheckedChange={(checked) => updateNestedSetting('integrations', 'stripe', 'enabled', checked)}
                  />
                </div>
                
                {settings?.integrations.stripe.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stripePublic">Public Key</Label>
                      <Input
                        id="stripePublic"
                        value={settings?.integrations.stripe.publicKey || ''}
                        onChange={(e) => updateNestedSetting('integrations', 'stripe', 'publicKey', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripeSecret">Secret Key</Label>
                      <Input
                        id="stripeSecret"
                        type={showPasswords ? 'text' : 'password'}
                        value={settings?.integrations.stripe.secretKey || ''}
                        onChange={(e) => updateNestedSetting('integrations', 'stripe', 'secretKey', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Access Control
              </CardTitle>
              <CardDescription>Configure security settings and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch
                  checked={settings?.security.twoFactorAuth || false}
                  onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="1"
                  max="168"
                  value={settings?.security.sessionTimeout || 24}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Password Complexity</Label>
                  <p className="text-sm text-muted-foreground">
                    Require complex passwords for user accounts
                  </p>
                </div>
                <Switch
                  checked={settings?.security.passwordComplexity || false}
                  onCheckedChange={(checked) => updateSetting('security', 'passwordComplexity', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
