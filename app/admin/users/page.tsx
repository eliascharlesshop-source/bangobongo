"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Mail,
  Calendar,
  Shield,
  UserPlus,
  UserMinus,
  Crown,
  Heart,
  ShoppingBag,
  Music,
  Ban,
  CheckCircle,
  AlertCircle,
  Clock
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'customer' | 'vip' | 'admin' | 'moderator'
  status: 'active' | 'inactive' | 'banned' | 'pending'
  joinedAt: string
  lastActive: string
  totalPurchases: number
  totalSpent: number
  favoriteGenres: string[]
  location: string
  verified: boolean
}

interface UserActivity {
  id: string
  userId: string
  type: 'purchase' | 'stream' | 'follow' | 'comment' | 'share'
  description: string
  timestamp: string
  metadata?: any
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers([
        {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          avatar: '/placeholder-user.jpg',
          role: 'customer',
          status: 'active',
          joinedAt: '2024-01-15',
          lastActive: '2024-01-20',
          totalPurchases: 3,
          totalSpent: 127.50,
          favoriteGenres: ['Electronic', 'Synthwave'],
          location: 'Los Angeles, CA',
          verified: true
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          role: 'vip',
          status: 'active',
          joinedAt: '2023-08-20',
          lastActive: '2024-01-19',
          totalPurchases: 12,
          totalSpent: 485.75,
          favoriteGenres: ['Electronic', 'Ambient'],
          location: 'New York, NY',
          verified: true
        },
        {
          id: '3',
          name: 'Mike Wilson',
          email: 'mike@example.com',
          role: 'customer',
          status: 'active',
          joinedAt: '2024-01-10',
          lastActive: '2024-01-18',
          totalPurchases: 1,
          totalSpent: 45.00,
          favoriteGenres: ['Electronic'],
          location: 'Chicago, IL',
          verified: false
        },
        {
          id: '4',
          name: 'Emily Davis',
          email: 'emily@example.com',
          role: 'customer',
          status: 'inactive',
          joinedAt: '2023-12-05',
          lastActive: '2023-12-20',
          totalPurchases: 0,
          totalSpent: 0,
          favoriteGenres: [],
          location: 'Austin, TX',
          verified: false
        },
        {
          id: '5',
          name: 'Admin User',
          email: 'admin@bangobongo.com',
          role: 'admin',
          status: 'active',
          joinedAt: '2023-01-01',
          lastActive: '2024-01-20',
          totalPurchases: 0,
          totalSpent: 0,
          favoriteGenres: ['Electronic', 'Synthwave', 'Ambient'],
          location: 'BangoBongo HQ',
          verified: true
        }
      ])

      setActivities([
        {
          id: '1',
          userId: '1',
          type: 'purchase',
          description: 'Purchased BangoBongo Hoodie',
          timestamp: '2 hours ago'
        },
        {
          id: '2',
          userId: '2',
          type: 'stream',
          description: 'Streamed "Digital Dreams" 15 times',
          timestamp: '4 hours ago'
        },
        {
          id: '3',
          userId: '3',
          type: 'follow',
          description: 'Followed BangoBongo on Spotify',
          timestamp: '1 day ago'
        },
        {
          id: '4',
          userId: '2',
          type: 'purchase',
          description: 'Purchased Digital Dreams Vinyl',
          timestamp: '2 days ago'
        },
        {
          id: '5',
          userId: '1',
          type: 'share',
          description: 'Shared "Midnight Pulse" on social media',
          timestamp: '3 days ago'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'moderator': return 'bg-purple-100 text-purple-800'
      case 'vip': return 'bg-yellow-100 text-yellow-800'
      case 'customer': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'banned': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'inactive': return <Clock className="h-4 w-4" />
      case 'banned': return <Ban className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />
      case 'moderator': return <Shield className="h-4 w-4" />
      case 'vip': return <Heart className="h-4 w-4" />
      case 'customer': return <Users className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <ShoppingBag className="h-4 w-4" />
      case 'stream': return <Music className="h-4 w-4" />
      case 'follow': return <UserPlus className="h-4 w-4" />
      case 'comment': return <Mail className="h-4 w-4" />
      case 'share': return <Heart className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const vipUsers = users.filter(u => u.role === 'vip').length
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user data...</p>
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage customers, fans, and user accounts</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-xs text-green-600">+12 this month</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-xs text-green-600">{Math.round((activeUsers/totalUsers)*100)}% of total</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">VIP Users</p>
                <p className="text-2xl font-bold">{vipUsers}</p>
                <p className="text-xs text-yellow-600">Premium members</p>
              </div>
              <Crown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">User Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-green-600">From purchases</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="analytics">User Analytics</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Purchases</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{user.name}</span>
                              {user.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                            </div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getRoleColor(user.role)} flex items-center gap-1 w-fit`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(user.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(user.status)}
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.totalPurchases}</TableCell>
                      <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
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
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            {user.role !== 'admin' && (
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="h-4 w-4 mr-2" />
                                Ban User
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

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>Latest user actions and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => {
                  const user = users.find(u => u.id === activity.userId)
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="p-2 rounded-full bg-muted">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user?.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>User distribution by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Austin, TX'].map((location) => {
                    const locationUsers = users.filter(u => u.location === location).length
                    const percentage = Math.round((locationUsers / totalUsers) * 100)
                    
                    return (
                      <div key={location} className="flex items-center justify-between">
                        <span className="text-sm">{location}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>User activity and engagement levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">High Engagement</span>
                    <span className="text-sm font-medium">
                      {users.filter(u => u.totalPurchases > 5).length} users
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Medium Engagement</span>
                    <span className="text-sm font-medium">
                      {users.filter(u => u.totalPurchases > 1 && u.totalPurchases <= 5).length} users
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Low Engagement</span>
                    <span className="text-sm font-medium">
                      {users.filter(u => u.totalPurchases <= 1).length} users
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Inactive Users</span>
                    <span className="text-sm font-medium">
                      {users.filter(u => u.status === 'inactive').length} users
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  VIP Members
                </CardTitle>
                <CardDescription>High-value customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{vipUsers}</p>
                  <p className="text-sm text-muted-foreground">
                    ${users.filter(u => u.role === 'vip').reduce((sum, u) => sum + u.totalSpent, 0).toFixed(2)} total spent
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                  Active Buyers
                </CardTitle>
                <CardDescription>Users with recent purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{users.filter(u => u.totalPurchases > 0).length}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((users.filter(u => u.totalPurchases > 0).length / totalUsers) * 100)}% conversion rate
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  Music Fans
                </CardTitle>
                <CardDescription>Users with favorite genres</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{users.filter(u => u.favoriteGenres.length > 0).length}</p>
                  <p className="text-sm text-muted-foreground">
                    Most popular: Electronic
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
