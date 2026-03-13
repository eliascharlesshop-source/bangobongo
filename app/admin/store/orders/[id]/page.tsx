"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  productSku: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  trackingNumber?: string
  shippingCarrier?: string
  notes: string
  createdAt: string
  updatedAt: string
  shippedAt?: string
  deliveredAt?: string
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const shippingCarriers = [
  'UPS', 'FedEx', 'USPS', 'DHL', 'Canada Post', 'Royal Mail', 'Australia Post'
]

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shippingCarrier, setShippingCarrier] = useState('')
  const [notes, setNotes] = useState('')
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        setNotes(data.order.notes || '')
      } else {
        throw new Error('Order not found')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setErrors({ fetch: 'Order not found' })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async () => {
    if (!newStatus) return
    
    setUpdating(true)
    
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
          shippingCarrier: shippingCarrier || undefined,
          notes: notes
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        setShowStatusDialog(false)
        setNewStatus('')
        setTrackingNumber('')
        setShippingCarrier('')
        setErrors({})
      } else {
        throw new Error('Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      setErrors({ update: 'Failed to update order. Please try again.' })
    } finally {
      setUpdating(false)
    }
  }

  const updateNotes = async () => {
    setUpdating(true)
    
    try {
      const response = await fetch(`/api/orders/${orderId}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        setErrors({})
      } else {
        throw new Error('Failed to update notes')
      }
    } catch (error) {
      console.error('Error updating notes:', error)
      setErrors({ notes: 'Failed to update notes. Please try again.' })
    } finally {
      setUpdating(false)
    }
  }

  const sendNotification = async (type: 'confirmation' | 'shipping' | 'delivery') => {
    setUpdating(true)
    
    try {
      const response = await fetch(`/api/orders/${orderId}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      })
      
      if (response.ok) {
        setErrors({})
      } else {
        throw new Error('Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      setErrors({ notification: 'Failed to send notification. Please try again.' })
    } finally {
      setUpdating(false)
    }
  }

  const downloadInvoice = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${order?.orderNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
      setErrors({ invoice: 'Failed to download invoice' })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order...</p>
          </div>
        </div>
      </div>
    )
  }

  if (errors.fetch) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-4">{errors.fetch}</p>
            <Button asChild>
              <Link href="/admin/store">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Link>
            </Button>
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
            <h1 className="text-3xl font-bold">Order #{order?.orderNumber}</h1>
            <p className="text-muted-foreground">Order details and management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={downloadInvoice}>
            <Download className="h-4 w-4 mr-2" />
            Invoice
          </Button>
          <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogDescription>
                  Change the order status and optionally add tracking information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(newStatus === 'shipped' || newStatus === 'delivered') && (
                  <>
                    <div className="space-y-2">
                      <Label>Shipping Carrier</Label>
                      <Select value={shippingCarrier} onValueChange={setShippingCarrier}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          {shippingCarriers.map((carrier) => (
                            <SelectItem key={carrier} value={carrier}>
                              {carrier}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tracking Number</Label>
                      <Input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this status change..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={updateOrderStatus} disabled={updating || !newStatus}>
                  {updating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {errors.update && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.update}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Products ordered by the customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order?.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {item.productSku}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order?.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order?.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order?.tax.toFixed(2)}</span>
                </div>
                {order?.discount && order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${order?.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Track the order progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">{order?.createdAt}</p>
                  </div>
                </div>
                
                {order?.status !== 'pending' && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-muted-foreground">{order?.updatedAt}</p>
                    </div>
                  </div>
                )}
                
                {order?.shippedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Shipped</p>
                      <p className="text-sm text-muted-foreground">{order.shippedAt}</p>
                      {order.trackingNumber && (
                        <p className="text-sm text-blue-600">
                          Tracking: {order.trackingNumber} ({order.shippingCarrier})
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {order?.deliveredAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-muted-foreground">{order.deliveredAt}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Order Status</span>
                <Badge className={statusColors[order?.status || 'pending']}>
                  {order?.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Status</span>
                <Badge className={paymentStatusColors[order?.paymentStatus || 'pending']}>
                  {order?.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Method</span>
                <span>{order?.paymentMethod}</span>
              </div>
              {order?.trackingNumber && (
                <div className="space-y-2">
                  <span>Tracking Information</span>
                  <div className="text-sm">
                    <p>{order.trackingNumber}</p>
                    <p>{order.shippingCarrier}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{order?.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{order?.customerEmail}</span>
              </div>
              {order?.customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{order.customerPhone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>{order?.shippingAddress.street}</p>
                <p>
                  {order?.shippingAddress.city}, {order?.shippingAddress.state} {order?.shippingAddress.zipCode}
                </p>
                <p>{order?.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => sendNotification('confirmation')}
                disabled={updating}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Confirmation
              </Button>
              
              {order?.status === 'processing' && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => sendNotification('shipping')}
                  disabled={updating}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Send Shipping Notice
                </Button>
              )}
              
              {order?.status === 'shipped' && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => sendNotification('delivery')}
                  disabled={updating}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Send Delivery Notice
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes about this order..."
                rows={4}
              />
              <Button 
                onClick={updateNotes} 
                disabled={updating}
                className="w-full"
              >
                {updating ? 'Saving...' : 'Save Notes'}
              </Button>
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</label>
}
