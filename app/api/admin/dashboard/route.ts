import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const db = getDatabase()
    
    // Get dashboard statistics
    const stats = {
      // User statistics
      totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number },
      newUsersToday: db.prepare(`
        SELECT COUNT(*) as count FROM users 
        WHERE date(created_at) = date('now')
      `).get() as { count: number },
      
      // Product statistics
      totalProducts: db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number },
      activeProducts: db.prepare('SELECT COUNT(*) as count FROM products WHERE in_stock = 1').get() as { count: number },
      
      // Order statistics
      totalOrders: db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number },
      pendingOrders: db.prepare(`
        SELECT COUNT(*) as count FROM orders 
        WHERE status = 'pending' OR payment_status = 'pending'
      `).get() as { count: number },
      completedOrders: db.prepare(`
        SELECT COUNT(*) as count FROM orders 
        WHERE status = 'completed' AND payment_status = 'completed'
      `).get() as { count: number },
      
      // Revenue statistics
      totalRevenue: db.prepare(`
        SELECT COALESCE(SUM(total), 0) as total FROM orders 
        WHERE payment_status = 'completed'
      `).get() as { total: number },
      revenueToday: db.prepare(`
        SELECT COALESCE(SUM(total), 0) as total FROM orders 
        WHERE payment_status = 'completed' AND date(created_at) = date('now')
      `).get() as { total: number },
      revenueThisMonth: db.prepare(`
        SELECT COALESCE(SUM(total), 0) as total FROM orders 
        WHERE payment_status = 'completed' 
        AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
      `).get() as { total: number },
      
      // Music statistics
      totalTracks: db.prepare('SELECT COUNT(*) as count FROM music').get() as { count: number },
      publishedTracks: db.prepare('SELECT COUNT(*) as count FROM music WHERE is_published = 1').get() as { count: number },
      
      // Tour statistics
      totalTours: db.prepare('SELECT COUNT(*) as count FROM tours').get() as { count: number },
      upcomingTours: db.prepare(`
        SELECT COUNT(*) as count FROM tours 
        WHERE date >= date('now') AND is_active = 1
      `).get() as { count: number }
    }
    
    // Recent orders
    const recentOrders = db.prepare(`
      SELECT 
        o.*,
        u.email as user_email,
        u.first_name,
        u.last_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `).all() as any[]
    
    // Top selling products
    const topProducts = db.prepare(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.image_url,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'completed'
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 5
    `).all() as any[]
    
    // Recent users
    const recentUsers = db.prepare(`
      SELECT id, email, first_name, last_name, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
    `).all() as any[]
    
    // Sales chart data (last 30 days)
    const salesChart = db.prepare(`
      SELECT 
        date(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders
      WHERE payment_status = 'completed'
        AND created_at >= date('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY date
    `).all() as any[]
    
    return successResponse({
      stats: {
        users: {
          total: stats.totalUsers.count,
          newToday: stats.newUsersToday.count
        },
        products: {
          total: stats.totalProducts.count,
          active: stats.activeProducts.count
        },
        orders: {
          total: stats.totalOrders.count,
          pending: stats.pendingOrders.count,
          completed: stats.completedOrders.count
        },
        revenue: {
          total: stats.totalRevenue.total,
          today: stats.revenueToday.total,
          thisMonth: stats.revenueThisMonth.total
        },
        music: {
          total: stats.totalTracks.count,
          published: stats.publishedTracks.count
        },
        tours: {
          total: stats.totalTours.count,
          upcoming: stats.upcomingTours.count
        }
      },
      recentOrders: recentOrders.map(order => ({
        ...order,
        shippingAddress: order.shipping_address ? JSON.parse(order.shipping_address) : null
      })),
      topProducts,
      recentUsers,
      salesChart
    })
    
  } catch (error: any) {
    console.error('Admin dashboard error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }
    
    return errorResponse('Failed to fetch dashboard data', 500)
  }
}