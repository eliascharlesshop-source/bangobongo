"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Store,
  DollarSign,
  Package,
  Truck,
  Mail,
  Globe,
  CreditCard,
  Settings,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"

interface StoreSettings {
  general: {
    storeName: string
    storeDescription: string
    contactEmail: string
    supportPhone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    timezone: string
    currency: string
    language: string
  }
  shipping: {
    freeShippingThreshold: number
    standardShippingRate: number
    expressShippingRate: number
    internationalShippingRate: number
    processingTime: string
    enableInternationalShipping: boolean
    trackingRequired: boolean
  }
  payment: {
    enableStripe: boolean
    stripePublicKey: string
    enablePayPal: boolean
    paypalEmail: string
    enableCrypto: boolean
    cryptoWalletAddress: string
    enableCashOnDelivery: boolean
  }
  tax: {
    enableTax: boolean
    taxRate: number
    taxIncluded: boolean
    taxShipping: boolean
  }
  notifications: {
    orderConfirmation: boolean
    shippingNotification: boolean
    deliveryNotification: boolean
    lowStockAlert: boolean
    adminEmail: string
  }
}

const timezones = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai'
]

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' }
]

export default function StoreSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [settings, setSettings] = useState<StoreSettings>({
    general: {
      storeName: '',
      storeDescription: '',
      contactEmail: '',
      supportPhone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      timezone: 'UTC',
      currency: 'USD',
      language: 'en'
    },
    shipping: {
      freeShippingThreshold: 100,
      standardShippingRate: 10,
      expressShippingRate: 25,
      internationalShippingRate: 50,
      processingTime: '1-2 business days',
      enableInternationalShipping: false,
      trackingRequired: true
    },
    payment: {
      enableStripe: false,
      stripePublicKey: '',
      enablePayPal: false,
      paypalEmail: '',
      enableCrypto: false,
      cryptoWalletAddress: '',
      enableCashOnDelivery: false
    },
    tax: {
      enableTax: false,
      taxRate: 0,
      taxIncluded: false,
      taxShipping: false
    },
    notifications: {
      orderConfirmation: true,
      shippingNotification: true,
      deliveryNotification: true,
      lowStockAlert: true,
      adminEmail: ''
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/store/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!settings.general.storeName.trim()) {
      newErrors.storeName = 'Store name is required'
    }
    
    if (!settings.general.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.general.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format'
    }
    
    if (settings.payment.enableStripe && !settings.payment.stripePublicKey.trim()) {
      newErrors.stripePublicKey = 'Stripe public key is required when Stripe is enabled'
    }
    
    if (settings.payment.enablePayPal && !settings.payment.paypalEmail.trim()) {
      newErrors.paypalEmail = 'PayPal email is required when PayPal is enabled'
    }
    
    if (settings.payment.enableCrypto && !settings.payment.cryptoWalletAddress.trim()) {
      newErrors.cryptoWalletAddress = 'Crypto wallet address is required when crypto payments are enabled'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }
    
    setSaving(true)
    setSaved(false)
    
    try {
      const response = await fetch('/api/admin/store/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      
      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        setErrors({})
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setErrors({ save: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (category: keyof StoreSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/store">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Store Settings</h1>
            <p className="text-muted-foreground">Configure your store preferences and settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {saved && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      {errors.save && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.save}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
              <CardDescription>Basic store details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Store Name *</Label>
                  <Input
                    value={settings.general.storeName}
                    onChange={(e) => updateSetting('general', 'storeName', e.target.value)}
                    placeholder="BangoBongo Store"
                    className={errors.storeName ? "border-red-500" : ""}
                  />
                  {errors.storeName && <p className="text-sm text-red-500">{errors.storeName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label>Contact Email *</Label>
                  <Input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                    placeholder="bangobongo.ece@gmail.com"
                    className={errors.contactEmail ? "border-red-500" : ""}
                  />
                  {errors.contactEmail && <p className="text-sm text-red-500">{errors.contactEmail}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Store Description</Label>
                <Textarea
                  value={settings.general.storeDescription}
                  onChange={(e) => updateSetting('general', 'storeDescription', e.target.value)}
                  placeholder="Official BangoBongo merchandise store"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Support Phone</Label>
                <Input
                  value={settings.general.supportPhone}
                  onChange={(e) => updateSetting('general', 'supportPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label>Store Address</Label>
                <Input
                  value={settings.general.address}
                  onChange={(e) => updateSetting('general', 'address', e.target.value)}
                  placeholder="123 Music Street"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={settings.general.city}
                    onChange={(e) => updateSetting('general', 'city', e.target.value)}
                    placeholder="Los Angeles"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={settings.general.state}
                    onChange={(e) => updateSetting('general', 'state', e.target.value)}
                    placeholder="CA"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>ZIP Code</Label>
                  <Input
                    value={settings.general.zipCode}
                    onChange={(e) => updateSetting('general', 'zipCode', e.target.value)}
                    placeholder="90210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={settings.general.country}
                  onChange={(e) => updateSetting('general', 'country', e.target.value)}
                  placeholder="United States"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={settings.general.timezone} onValueChange={(value) => updateSetting('general', 'timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.general.currency} onValueChange={(value) => updateSetting('general', 'currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.general.language} onValueChange={(value) => updateSetting('general', 'language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Configuration
              </CardTitle>
              <CardDescription>Set up shipping rates and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Free Shipping Threshold ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.shipping.freeShippingThreshold}
                  onChange={(e) => updateSetting('shipping', 'freeShippingThreshold', parseFloat(e.target.value) || 0)}
                  placeholder="100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Standard Shipping Rate ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.shipping.standardShippingRate}
                    onChange={(e) => updateSetting('shipping', 'standardShippingRate', parseFloat(e.target.value) || 0)}
                    placeholder="10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Express Shipping Rate ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.shipping.expressShippingRate}
                    onChange={(e) => updateSetting('shipping', 'expressShippingRate', parseFloat(e.target.value) || 0)}
                    placeholder="25"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>International Shipping Rate ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.shipping.internationalShippingRate}
                    onChange={(e) => updateSetting('shipping', 'internationalShippingRate', parseFloat(e.target.value) || 0)}
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Processing Time</Label>
                <Input
                  value={settings.shipping.processingTime}
                  onChange={(e) => updateSetting('shipping', 'processingTime', e.target.value)}
                  placeholder="1-2 business days"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.shipping.enableInternationalShipping}
                    onCheckedChange={(checked) => updateSetting('shipping', 'enableInternationalShipping', checked)}
                  />
                  <Label>Enable International Shipping</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.shipping.trackingRequired}
                    onCheckedChange={(checked) => updateSetting('shipping', 'trackingRequired', checked)}
                  />
                  <Label>Require Tracking for All Orders</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Configure accepted payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Stripe</h3>
                    <p className="text-sm text-muted-foreground">Accept credit and debit cards</p>
                  </div>
                  <Switch
                    checked={settings.payment.enableStripe}
                    onCheckedChange={(checked) => updateSetting('payment', 'enableStripe', checked)}
                  />
                </div>
                
                {settings.payment.enableStripe && (
                  <div className="space-y-2">
                    <Label>Stripe Public Key</Label>
                    <Input
                      value={settings.payment.stripePublicKey}
                      onChange={(e) => updateSetting('payment', 'stripePublicKey', e.target.value)}
                      placeholder="pk_test_..."
                      className={errors.stripePublicKey ? "border-red-500" : ""}
                    />
                    {errors.stripePublicKey && <p className="text-sm text-red-500">{errors.stripePublicKey}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">PayPal</h3>
                    <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                  </div>
                  <Switch
                    checked={settings.payment.enablePayPal}
                    onCheckedChange={(checked) => updateSetting('payment', 'enablePayPal', checked)}
                  />
                </div>
                
                {settings.payment.enablePayPal && (
                  <div className="space-y-2">
                    <Label>PayPal Email</Label>
                    <Input
                      type="email"
                      value={settings.payment.paypalEmail}
                      onChange={(e) => updateSetting('payment', 'paypalEmail', e.target.value)}
                      placeholder="bangobongo.ece@gmail.com"
                      className={errors.paypalEmail ? "border-red-500" : ""}
                    />
                    {errors.paypalEmail && <p className="text-sm text-red-500">{errors.paypalEmail}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Cryptocurrency</h3>
                    <p className="text-sm text-muted-foreground">Accept Bitcoin, Ethereum, etc.</p>
                  </div>
                  <Switch
                    checked={settings.payment.enableCrypto}
                    onCheckedChange={(checked) => updateSetting('payment', 'enableCrypto', checked)}
                  />
                </div>
                
                {settings.payment.enableCrypto && (
                  <div className="space-y-2">
                    <Label>Crypto Wallet Address</Label>
                    <Textarea
                      value={settings.payment.cryptoWalletAddress}
                      onChange={(e) => updateSetting('payment', 'cryptoWalletAddress', e.target.value)}
                      placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                      rows={3}
                      className={errors.cryptoWalletAddress ? "border-red-500" : ""}
                    />
                    {errors.cryptoWalletAddress && <p className="text-sm text-red-500">{errors.cryptoWalletAddress}</p>}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Cash on Delivery</h3>
                  <p className="text-sm text-muted-foreground">Accept cash on delivery for eligible orders</p>
                </div>
                <Switch
                  checked={settings.payment.enableCashOnDelivery}
                  onCheckedChange={(checked) => updateSetting('payment', 'enableCashOnDelivery', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tax Configuration
              </CardTitle>
              <CardDescription>Set up tax rates and calculation rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.tax.enableTax}
                  onCheckedChange={(checked) => updateSetting('tax', 'enableTax', checked)}
                />
                <Label>Enable Tax Calculation</Label>
              </div>

              {settings.tax.enableTax && (
                <>
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={settings.tax.taxRate}
                      onChange={(e) => updateSetting('tax', 'taxRate', parseFloat(e.target.value) || 0)}
                      placeholder="8.5"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.tax.taxIncluded}
                        onCheckedChange={(checked) => updateSetting('tax', 'taxIncluded', checked)}
                      />
                      <Label>Include tax in product prices</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.tax.taxShipping}
                        onCheckedChange={(checked) => updateSetting('tax', 'taxShipping', checked)}
                      />
                      <Label>Apply tax to shipping costs</Label>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>Configure customer and admin notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Admin Notification Email</Label>
                <Input
                  type="email"
                  value={settings.notifications.adminEmail}
                  onChange={(e) => updateSetting('notifications', 'adminEmail', e.target.value)}
                  placeholder="bangobongo.ece@gmail.com"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Order Confirmation</h3>
                    <p className="text-sm text-muted-foreground">Send order confirmation to customers</p>
                  </div>
                  <Switch
                    checked={settings.notifications.orderConfirmation}
                    onCheckedChange={(checked) => updateSetting('notifications', 'orderConfirmation', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Shipping Notification</h3>
                    <p className="text-sm text-muted-foreground">Notify when order ships</p>
                  </div>
                  <Switch
                    checked={settings.notifications.shippingNotification}
                    onCheckedChange={(checked) => updateSetting('notifications', 'shippingNotification', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Delivery Notification</h3>
                    <p className="text-sm text-muted-foreground">Notify when order is delivered</p>
                  </div>
                  <Switch
                    checked={settings.notifications.deliveryNotification}
                    onCheckedChange={(checked) => updateSetting('notifications', 'deliveryNotification', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Low Stock Alerts</h3>
                    <p className="text-sm text-muted-foreground">Alert when products are low in stock</p>
                  </div>
                  <Switch
                    checked={settings.notifications.lowStockAlert}
                    onCheckedChange={(checked) => updateSetting('notifications', 'lowStockAlert', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
