import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/db/index-with-sqlite'
import { requireAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const createMusicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album: z.string().optional(),
  genre: z.string().optional(),
  releaseDate: z.string().optional(),
  duration: z.number().positive().optional(),
  trackNumber: z.number().positive().optional(),
  audioUrl: z.string().url().optional(),
  previewUrl: z.string().url().optional(),
  coverArt: z.string().url().optional(),
  lyrics: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  price: z.number().positive().optional(),
  cryptoPrice: z.number().positive().optional(),
  streamingLinks: z.object({
    spotify: z.string().url().optional(),
    apple: z.string().url().optional(),
    youtube: z.string().url().optional(),
    soundcloud: z.string().url().optional()
  }).optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const album = searchParams.get('album')
    const genre = searchParams.get('genre')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const db = getDatabase()

    // Build query
    let query = 'SELECT * FROM music WHERE 1=1'
    const params: any[] = []

    if (album) {
      query += ' AND album LIKE ?'
      params.push(`%${album}%`)
    }

    if (genre) {
      query += ' AND genre = ?'
      params.push(genre)
    }

    if (featured === 'true') {
      query += ' AND is_featured = 1'
    }

    if (published === 'true') {
      query += ' AND is_published = 1'
    } else if (published === 'false') {
      query += ' AND is_published = 0'
    }

    if (search) {
      query += ' AND (title LIKE ? OR artist LIKE ? OR album LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count')
    const totalCount = db.prepare(countQuery).get(...params) as { count: number }

    // Add pagination and ordering
    query += ' ORDER BY release_date DESC, track_number ASC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const music = db.prepare(query).all(...params) as any[]

    // Parse JSON fields
    const formattedMusic = music.map(track => ({
      ...track,
      streamingLinks: track.streaming_links ? JSON.parse(track.streaming_links) : {}
    }))

    return successResponse({
      music: formattedMusic,
      pagination: {
        page,
        limit,
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    })

  } catch (error: any) {
    console.error('Get music error:', error)
    return errorResponse('Failed to fetch music', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin(request)

    const body = await request.json()

    // Validate input
    const validation = createMusicSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }

    const data = validation.data
    const { v4: uuidv4 } = require('uuid')
    const musicId = uuidv4()

    const db = getDatabase()

    // Insert music
    db.prepare(`
      INSERT INTO music (
        id, title, artist, album, genre, release_date, duration, track_number,
        audio_url, preview_url, cover_art, lyrics, is_published, is_featured,
        price, crypto_price, streaming_links
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      musicId,
      data.title,
      data.artist,
      data.album || null,
      data.genre || null,
      data.releaseDate || null,
      data.duration || null,
      data.trackNumber || null,
      data.audioUrl || null,
      data.previewUrl || null,
      data.coverArt || null,
      data.lyrics || null,
      data.isPublished,
      data.isFeatured,
      data.price || null,
      data.cryptoPrice || null,
      data.streamingLinks ? JSON.stringify(data.streamingLinks) : null
    )

    // Get the created music
    const music = db.prepare('SELECT * FROM music WHERE id = ?').get(musicId) as any

    const formattedMusic = {
      ...music,
      streamingLinks: music.streaming_links ? JSON.parse(music.streaming_links) : {}
    }

    return successResponse(formattedMusic, 'Music created successfully')

  } catch (error: any) {
    console.error('Create music error:', error)

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }

    return errorResponse('Failed to create music', 500)
  }
}