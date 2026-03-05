import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const createMusicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required').default('BangoBongo'),
  album: z.string().optional(),
  genre: z.string().optional(),
  releaseDate: z.string().optional(),
  duration: z.number().positive('Duration must be positive').optional(),
  trackNumber: z.number().positive('Track number must be positive').optional(),
  audioUrl: z.string().url('Audio URL must be valid').optional(),
  previewUrl: z.string().url('Preview URL must be valid').optional(),
  coverArt: z.string().url('Cover art URL must be valid').optional(),
  lyrics: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  price: z.number().positive().optional(),
  cryptoPrice: z.number().positive().optional(),
  streamingLinks: z.object({
    spotify: z.string().url().optional(),
    apple: z.string().url().optional(),
    youtube: z.string().url().optional(),
    soundcloud: z.string().url().optional(),
    bandcamp: z.string().url().optional(),
    deezer: z.string().url().optional()
  }).optional()
})

const updateMusicSchema = createMusicSchema.partial()

// GET: List all music tracks for admin
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

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
    let query = `
      SELECT 
        *,
        (play_count + like_count + download_count) as engagement_score
      FROM music 
      WHERE 1=1
    `
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
      query += ' AND (title LIKE ? OR artist LIKE ? OR album LIKE ? OR genre LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }

    // Get total count for pagination
    const countQuery = query.replace('SELECT *, (play_count + like_count + download_count) as engagement_score', 'SELECT COUNT(*) as count')
    const totalCount = db.prepare(countQuery).get(...params) as { count: number }

    // Add ordering and pagination
    query += ' ORDER BY engagement_score DESC, created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const music = db.prepare(query).all(...params) as any[]

    // Parse JSON fields and format data
    const formattedMusic = music.map(track => ({
      ...track,
      streamingLinks: track.streaming_links ? JSON.parse(track.streaming_links) : {},
      releaseDate: track.release_date,
      isPublished: !!track.is_published,
      isFeatured: !!track.is_featured,
      audioUrl: track.audio_url,
      previewUrl: track.preview_url,
      coverArt: track.cover_art,
      playCount: track.play_count,
      likeCount: track.like_count,
      downloadCount: track.download_count,
      trackNumber: track.track_number,
      cryptoPrice: track.crypto_price,
      engagementScore: track.engagement_score
    }))

    // Get additional statistics
    const stats = {
      total: totalCount.count,
      published: db.prepare('SELECT COUNT(*) as count FROM music WHERE is_published = 1').get() as { count: number },
      featured: db.prepare('SELECT COUNT(*) as count FROM music WHERE is_featured = 1').get() as { count: number },
      unpublished: db.prepare('SELECT COUNT(*) as count FROM music WHERE is_published = 0').get() as { count: number },
      totalPlays: db.prepare('SELECT SUM(play_count) as total FROM music').get() as { total: number },
      totalLikes: db.prepare('SELECT SUM(like_count) as total FROM music').get() as { total: number }
    }

    return successResponse({
      music: formattedMusic,
      stats: {
        total: totalCount.count,
        published: stats.published.count,
        featured: stats.featured.count,
        unpublished: stats.unpublished.count,
        totalPlays: stats.totalPlays.total || 0,
        totalLikes: stats.totalLikes.total || 0
      },
      pagination: {
        page,
        limit,
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    })

  } catch (error: any) {
    console.error('Admin get music error:', error)

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }

    return errorResponse('Failed to fetch music for admin', 500)
  }
}

// POST: Create new music track
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()

    // Validate input
    const validation = createMusicSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return validationErrorResponse(errors)
    }

    const data = validation.data
    const { v4: uuidv4 } = require('uuid')
    const musicId = uuidv4()

    const db = getDatabase()

    // Insert new music track
    const stmt = db.prepare(`
      INSERT INTO music (
        id, title, artist, album, genre, release_date, duration, track_number,
        audio_url, preview_url, cover_art, lyrics, is_published, is_featured,
        price, crypto_price, streaming_links, play_count, like_count, download_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)
    `)

    stmt.run(
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
      data.isPublished ? 1 : 0,
      data.isFeatured ? 1 : 0,
      data.price || null,
      data.cryptoPrice || null,
      data.streamingLinks ? JSON.stringify(data.streamingLinks) : null
    )

    // Get the created music track
    const music = db.prepare('SELECT * FROM music WHERE id = ?').get(musicId) as any

    const formattedMusic = {
      ...music,
      streamingLinks: music.streaming_links ? JSON.parse(music.streaming_links) : {},
      releaseDate: music.release_date,
      isPublished: !!music.is_published,
      isFeatured: !!music.is_featured,
      audioUrl: music.audio_url,
      previewUrl: music.preview_url,
      coverArt: music.cover_art,
      playCount: music.play_count,
      likeCount: music.like_count,
      downloadCount: music.download_count,
      trackNumber: music.track_number,
      cryptoPrice: music.crypto_price
    }

    return successResponse(formattedMusic, 'Music track created successfully')

  } catch (error: any) {
    console.error('Create music error:', error)

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }

    return errorResponse('Failed to create music track', 500)
  }
}

// PUT: Update existing music track
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return errorResponse('Music track ID is required', 400)
    }

    // Validate input
    const validation = updateMusicSchema.safeParse(updateData)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return validationErrorResponse(errors)
    }

    const data = validation.data
    const db = getDatabase()

    // Check if track exists
    const existingTrack = db.prepare('SELECT * FROM music WHERE id = ?').get(id)
    if (!existingTrack) {
      return errorResponse('Music track not found', 404)
    }

    // Build update query dynamically
    const updateFields = []
    const params = []

    if (data.title !== undefined) {
      updateFields.push('title = ?')
      params.push(data.title)
    }
    if (data.artist !== undefined) {
      updateFields.push('artist = ?')
      params.push(data.artist)
    }
    if (data.album !== undefined) {
      updateFields.push('album = ?')
      params.push(data.album)
    }
    if (data.genre !== undefined) {
      updateFields.push('genre = ?')
      params.push(data.genre)
    }
    if (data.releaseDate !== undefined) {
      updateFields.push('release_date = ?')
      params.push(data.releaseDate)
    }
    if (data.duration !== undefined) {
      updateFields.push('duration = ?')
      params.push(data.duration)
    }
    if (data.trackNumber !== undefined) {
      updateFields.push('track_number = ?')
      params.push(data.trackNumber)
    }
    if (data.audioUrl !== undefined) {
      updateFields.push('audio_url = ?')
      params.push(data.audioUrl)
    }
    if (data.previewUrl !== undefined) {
      updateFields.push('preview_url = ?')
      params.push(data.previewUrl)
    }
    if (data.coverArt !== undefined) {
      updateFields.push('cover_art = ?')
      params.push(data.coverArt)
    }
    if (data.lyrics !== undefined) {
      updateFields.push('lyrics = ?')
      params.push(data.lyrics)
    }
    if (data.isPublished !== undefined) {
      updateFields.push('is_published = ?')
      params.push(data.isPublished ? 1 : 0)
    }
    if (data.isFeatured !== undefined) {
      updateFields.push('is_featured = ?')
      params.push(data.isFeatured ? 1 : 0)
    }
    if (data.price !== undefined) {
      updateFields.push('price = ?')
      params.push(data.price)
    }
    if (data.cryptoPrice !== undefined) {
      updateFields.push('crypto_price = ?')
      params.push(data.cryptoPrice)
    }
    if (data.streamingLinks !== undefined) {
      updateFields.push('streaming_links = ?')
      params.push(JSON.stringify(data.streamingLinks))
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    params.push(id)

    const query = `UPDATE music SET ${updateFields.join(', ')} WHERE id = ?`
    db.prepare(query).run(...params)

    // Get updated track
    const updatedTrack = db.prepare('SELECT * FROM music WHERE id = ?').get(id) as any

    const formattedMusic = {
      ...updatedTrack,
      streamingLinks: updatedTrack.streaming_links ? JSON.parse(updatedTrack.streaming_links) : {},
      releaseDate: updatedTrack.release_date,
      isPublished: !!updatedTrack.is_published,
      isFeatured: !!updatedTrack.is_featured,
      audioUrl: updatedTrack.audio_url,
      previewUrl: updatedTrack.preview_url,
      coverArt: updatedTrack.cover_art,
      playCount: updatedTrack.play_count,
      likeCount: updatedTrack.like_count,
      downloadCount: updatedTrack.download_count,
      trackNumber: updatedTrack.track_number,
      cryptoPrice: updatedTrack.crypto_price
    }

    return successResponse(formattedMusic, 'Music track updated successfully')

  } catch (error: any) {
    console.error('Update music error:', error)

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }

    return errorResponse('Failed to update music track', 500)
  }
}

// DELETE: Delete music track
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return errorResponse('Music track ID is required', 400)
    }

    const db = getDatabase()

    // Check if track exists
    const existingTrack = db.prepare('SELECT * FROM music WHERE id = ?').get(id)
    if (!existingTrack) {
      return errorResponse('Music track not found', 404)
    }

    // Delete the track
    db.prepare('DELETE FROM music WHERE id = ?').run(id)

    return successResponse({ deleted: true }, 'Music track deleted successfully')

  } catch (error: any) {
    console.error('Delete music error:', error)

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }

    return errorResponse('Failed to delete music track', 500)
  }
}
