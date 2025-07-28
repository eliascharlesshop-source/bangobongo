"use client"

import { useState, useEffect } from "react"
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface Transaction {
  id: string
  type: 'payment' | 'refund' | 'payout' | 'fee'
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  description: string
  customerName?: string
  customerEmail?: string
  paymentMethod: string
  timestamp: string
  stripeId?: string
  orderId?: string
}

interface PayoutRecord {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed'
  payoutDate: string
  transactionCount: number
  feeAmount: number
  netAmount: number
}

interface PaymentAnalytics {
  totalRevenue: number
  revenueChange: number
  totalTransactions: number
  transactionsChange: number
  avgTransactionValue: number
  avgChange: number
  successRate: number
  rateChange: number
}

export default function PaymentsManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [payouts, setPayouts] = useState<PayoutRecord[]>([])
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    fetchPaymentData()
  }, [])

  const fetchPaymentData = async () => {
    try {
      // Simulate API calls - replace with actual payment API endpoints
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTransactions([
        {
          id: 'txn_001',
          type: 'payment',
          amount: 45.00,
          currency: 'USD',
          status: 'completed',
          description: 'BangoBongo Hoodie purchase',
          customerName: 'John Smith',
          customerEmail: 'john@example.com',
          paymentMethod: 'Visa ****4242',
          timestamp: '2024-01-20 14:30:00',
          stripeId: 'pi_1234567890',
          orderId: 'ORD-001'
        },
        {
          id: 'txn_002',
          type: 'payment',
          amount: 85.00,
          currency: 'USD',
          status: 'completed',
          description: 'Digital Dreams Vinyl + T-Shirt',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@example.com',
          paymentMethod: 'Mastercard ****8888',
          timestamp: '2024-01-19 16:45:00',
          stripeId: 'pi_0987654321',
          orderId: 'ORD-002'
        },
        {
          id: 'txn_003',
          type: 'payment',
          amount: 199.00,
          currency: 'USD',
          status: 'failed',
          description: 'Studio Headphones purchase',
          customerName: 'Mike Wilson',
          customerEmail: 'mike@example.com',
          paymentMethod: 'Visa ****1234',
          timestamp: '2024-01-19 10:15:00',
          stripeId: 'pi_1122334455'
        },
        {
          id: 'txn_004',
          type: 'refund',
          amount: -25.00,
          currency: 'USD',
          status: 'completed',
          description: 'Refund for cancelled order',
          customerName: 'Emily Davis',
          customerEmail: 'emily@example.com',
          paymentMethod: 'Visa ****5678',
          timestamp: '2024-01-18 12:20:00',
          stripeId: 're_9988776655',
          orderId: 'ORD-003'
        },
        {
          id: 'txn_005',
          type: 'payout',
          amount: -850.50,
          currency: 'USD',
          status: 'pending',
          description: 'Weekly payout to bank account',
          paymentMethod: 'Bank Transfer ****1234',
          timestamp: '2024-01-18 09:00:00'
        },
        {
          id: 'txn_006',
          type: 'fee',
          amount: -12.75,
          currency: 'USD',
          status: 'completed',
          description: 'Stripe processing fees',
          paymentMethod: 'Stripe',
          timestamp: '2024-01-17 23:59:00'
        }
      ])

      setPayouts([
        {
          id: 'payout_001',
          amount: 850.50,
          currency: 'USD',
          status: 'pending',
          payoutDate: '2024-01-22',
          transactionCount: 15,
          feeAmount: 25.50,
          netAmount: 825.00
        },
        {
          id: 'payout_002',
          amount: 1250.75,
          currency: 'USD',
          status: 'paid',
          payoutDate: '2024-01-15',
          transactionCount: 22,
          feeAmount: 37.50,
          netAmount: 1213.25
        },
        {
          id: 'payout_003',
          amount: 680.25,
          currency: 'USD',
          status: 'paid',
          payoutDate: '2024-01-08',
          transactionCount: 12,
          feeAmount: 20.40,
          netAmount: 659.85
        }
      ])

      setAnalytics({
        totalRevenue: 8750.25,
        revenueChange: 12.5,
        totalTransactions: 156,
        transactionsChange: 8.3,
        avgTransactionValue: 56.09,
        avgChange: 4.2,
        successRate: 94.2,
        rateChange: 1.8
      })
    } catch (error) {
      console.error('Failed to fetch payment data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': 
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': 
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'failed':
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'refund': return <ArrowDownLeft className="h-4 w-4 text-red-600" />
      case 'payout': return <ArrowDownLeft className="h-4 w-4 text-blue-600" />
      case 'fee': return <ArrowDownLeft className="h-4 w-4 text-orange-600" />
      default: return <CreditCard className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(Math.abs(amount))
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />
    if (change < 0) return <ArrowDownLeft className="h-3 w-3" />
    return null
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    const matchesType = filterType === 'all' || transaction.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading payment data...</p>
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
          <h1 className="text-3xl font-bold">Payments & Billing</h1>
          <p className="text-muted-foreground">Manage transactions, payouts, and financial data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Stripe
          </Button>
        </div>
      </div>

      {/* Payment Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics?.totalRevenue || 0)}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(analytics?.revenueChange || 0)}`}>
                  {getChangeIcon(analytics?.revenueChange || 0)}
                  <span>{Math.abs(analytics?.revenueChange || 0)}% vs last period</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{analytics?.totalTransactions}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(analytics?.transactionsChange || 0)}`}>
                  {getChangeIcon(analytics?.transactionsChange || 0)}
                  <span>{Math.abs(analytics?.transactionsChange || 0)}% vs last period</span>
                </div>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Transaction</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics?.avgTransactionValue || 0)}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(analytics?.avgChange || 0)}`}>
                  {getChangeIcon(analytics?.avgChange || 0)}
                  <span>{Math.abs(analytics?.avgChange || 0)}% vs last period</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{analytics?.successRate}%</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(analytics?.rateChange || 0)}`}>
                  {getChangeIcon(analytics?.rateChange || 0)}
                  <span>{Math.abs(analytics?.rateChange || 0)}% vs last period</span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                    <SelectItem value="refund">Refunds</SelectItem>
                    <SelectItem value="payout">Payouts</SelectItem>
                    <SelectItem value="fee">Fees</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transactions Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getTypeIcon(transaction.type)}
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.customerName ? (
                          <div>
                            <div className="font-medium">{transaction.customerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.customerEmail}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{transaction.paymentMethod}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(transaction.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {transaction.orderId && (
                              <DropdownMenuItem>
                                <Receipt className="h-4 w-4 mr-2" />
                                View Order
                              </DropdownMenuItem>
                            )}
                            {transaction.type === 'payment' && transaction.status === 'completed' && (
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Issue Refund
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>View scheduled and completed payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payout Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.id}</TableCell>
                      <TableCell>{formatCurrency(payout.amount, payout.currency)}</TableCell>
                      <TableCell>{payout.transactionCount} transactions</TableCell>
                      <TableCell className="text-red-600">
                        -{formatCurrency(payout.feeAmount, payout.currency)}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(payout.netAmount, payout.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(payout.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(payout.status)}
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payout.payoutDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: 'Visa', percentage: 45, transactions: 68 },
                    { method: 'Mastercard', percentage: 32, transactions: 48 },
                    { method: 'PayPal', percentage: 15, transactions: 22 },
                    { method: 'Apple Pay', percentage: 8, transactions: 12 }
                  ].map((method) => (
                    <div key={method.method} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{method.method}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${method.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">
                          {method.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Status</CardTitle>
                <CardDescription>Breakdown of transaction statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium text-green-600">
                      {transactions.filter(t => t.status === 'completed').length} transactions
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {transactions.filter(t => t.status === 'pending').length} transactions
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Failed</span>
                    <span className="text-sm font-medium text-red-600">
                      {transactions.filter(t => t.status === 'failed').length} transactions
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Refunded</span>
                    <span className="text-sm font-medium text-blue-600">
                      {transactions.filter(t => t.type === 'refund').length} transactions
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>Configure payment processing settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Payment Settings</h3>
                <p>Payment configuration would be managed here</p>
                <p className="text-sm">Integration with Stripe settings, payment methods, and billing preferences</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
