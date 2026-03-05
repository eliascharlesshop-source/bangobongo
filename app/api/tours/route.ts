import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const createTourSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(1, 'Venue is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  ticketPrice: z.number().positive().optional(),
  cryptoTicketPrice: z.number().positive().optional(),
  ticketUrl: z.string().url().optional(),
  venueUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  isSoldOut: z.boolean().default(false),
  capacity: z.number().positive().optional(),
  ageRestriction: z.string().optional(),
  doors: z.string().optional(),
  showTime: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get('upcoming')
    const city = searchParams.get('city')
    const country = searchParams.get('country')
    const active = searchParams.get('active')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const db = getDatabase()

    // Build query
    let query = 'SELECT * FROM tours WHERE 1=1'
    const params: any[] = []

    if (upcoming === 'true') {
      query += ' AND date >= date("now")'
    }

    if (city) {
      query += ' AND city LIKE ?'
      params.push(`%${city}%`)
    }

    if (country) {
      query += ' AND country = ?'
      params.push(country)
    }

    if (active === 'true') {
      query += ' AND is_active = 1'
    } else if (active === 'false') {
      query += ' AND is_active = 0'
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count')
    const totalCount = db.prepare(countQuery).get(...params) as { count: number }

    // Add pagination and ordering
    query += ' ORDER BY date ASC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const tours = db.prepare(query).all(...params) as any[]

    return successResponse({
      tours,
      pagination: {
        page,
        limit,
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    })

  } catch (error: any) {
    console.error('Get tours error:', error)
    return errorResponse('Failed to fetch tours', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin(request)

    const body = await request.json()

    // Validate input
    const validation = createTourSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }

    const data = validation.data
    const { v4: uuidv4 } = require('uuid')
    const tourId = uuidv4()

    const db = getDatabase()

    // Insert tour
    db.prepare(`
      INSERT INTO tours (
        id, title, description, date, venue, city, state, country,
        ticket_price, crypto_ticket_price, ticket_url, venue_url, image_url,
        is_active, is_sold_out, capacity, age_restriction, doors, show_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      tourId,
      data.title,
      data.description || null,
      data.date,
      data.venue,
      data.city,
      data.state || null,
      data.country,
      data.ticketPrice || null,
      data.cryptoTicketPrice || null,
      data.ticketUrl || null,
      data.venueUrl || null,
      data.imageUrl || null,
      data.isActive,
      data.isSoldOut,
      data.capacity || null,
      data.ageRestriction || null,
      data.doors || null,
      data.showTime || null
    )

    // Get the created tour
    const tour = db.prepare('SELECT * FROM tours WHERE id = ?').get(tourId) as any

    return successResponse(tour, 'Tour created successfully')

  } catch (error: any) {
    console.error('Create tour error:', error)

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }

    return errorResponse('Failed to create tour', 500)
  }
}