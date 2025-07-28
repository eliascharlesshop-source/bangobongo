import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// Add sample music data for testing
export async function POST(request: NextRequest) {
  try {
    const db = getDatabase()
    const { v4: uuidv4 } = require('uuid')

    // Sample BangoBongo tracks with development-friendly audio
    const sampleTracks = [
      {
        id: uuidv4(),
        title: 'Digital Dreams',
        artist: 'BangoBongo',
        album: 'Electronic Horizons',
        genre: 'Electronic',
        release_date: '2024-12-01',
        duration: 245, // 4:05
        track_number: 1,
        audio_url: '/audio/demo-track-1.mp3', // Local development audio
        preview_url: '/audio/demo-track-1.mp3',
        cover_art: '/abstract-electronic-album-art.png',
        lyrics: 'Electric pulses through the night\nSynthetic dreams in neon light\nDigital worlds collide tonight',
        is_published: 1,
        is_featured: 1,
        price: 2.99,
        crypto_price: 0.000039,
        streaming_links: JSON.stringify({
          spotify: 'https://open.spotify.com/track/example',
          youtube: 'https://youtube.com/watch?v=example',
          soundcloud: 'https://soundcloud.com/bangobongo/digital-dreams'
        }),
        play_count: 1250,
        like_count: 89,
        download_count: 23
      },
      {
        id: uuidv4(),
        title: 'Neon Nights',
        artist: 'BangoBongo',
        album: 'Electronic Horizons',
        genre: 'Synthwave',
        release_date: '2024-12-01',
        duration: 312, // 5:12
        track_number: 2,
        audio_url: '/audio/demo-track-2.mp3',
        preview_url: '/audio/demo-track-2.mp3',
        cover_art: '/synthwave-album-art.png',
        lyrics: 'Neon lights illuminate the street\nSynthetic bass with retro beat\nCyberpunk dreams beneath our feet',
        is_published: 1,
        is_featured: 1,
        price: 2.99,
        crypto_price: 0.000039,
        streaming_links: JSON.stringify({
          spotify: 'https://open.spotify.com/track/example2',
          youtube: 'https://youtube.com/watch?v=example2',
          soundcloud: 'https://soundcloud.com/bangobongo/neon-nights'
        }),
        play_count: 892,
        like_count: 67,
        download_count: 18
      },
      {
        id: uuidv4(),
        title: 'Cyberpunk Frequencies',
        artist: 'BangoBongo',
        album: 'Future Bass Collection',
        genre: 'Future Bass',
        release_date: '2024-11-15',
        duration: 198, // 3:18
        track_number: 1,
        audio_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        preview_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        cover_art: '/cyberpunk-electronic-album.png',
        lyrics: 'Binary code flows through my veins\nElectronic pulse breaks all chains\nFuture bass drops like digital rain',
        is_published: 1,
        is_featured: 0,
        price: 2.99,
        crypto_price: 0.000039,
        streaming_links: JSON.stringify({
          spotify: 'https://open.spotify.com/track/example3',
          youtube: 'https://youtube.com/watch?v=example3',
          soundcloud: 'https://soundcloud.com/bangobongo/cyberpunk-frequencies'
        }),
        play_count: 567,
        like_count: 45,
        download_count: 12
      },
      {
        id: uuidv4(),
        title: 'Atmospheric Vibes',
        artist: 'BangoBongo',
        album: 'Ambient Electronic',
        genre: 'Ambient',
        release_date: '2024-10-20',
        duration: 420, // 7:00
        track_number: 1,
        audio_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        preview_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        cover_art: '/dark-electronic-album-art.png',
        lyrics: 'Floating through ethereal space\nSynthetic waves at gentle pace\nAmbient sounds fill every place',
        is_published: 1,
        is_featured: 0,
        price: 3.99,
        crypto_price: 0.000052,
        streaming_links: JSON.stringify({
          spotify: 'https://open.spotify.com/track/example4',
          youtube: 'https://youtube.com/watch?v=example4',
          soundcloud: 'https://soundcloud.com/bangobongo/atmospheric-vibes'
        }),
        play_count: 334,
        like_count: 28,
        download_count: 8
      },
      {
        id: uuidv4(),
        title: 'Futuristic Pulse',
        artist: 'BangoBongo',
        album: 'Future Bass Collection',
        genre: 'Future Bass',
        release_date: '2024-11-15',
        duration: 267, // 4:27
        track_number: 2,
        audio_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        preview_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        cover_art: '/futuristic-electronic-album-art.png',
        lyrics: 'Tomorrow\'s sound today we bring\nFuturistic melodies that sing\nElectronic heartbeat on the wing',
        is_published: 1,
        is_featured: 1,
        price: 2.99,
        crypto_price: 0.000039,
        streaming_links: JSON.stringify({
          spotify: 'https://open.spotify.com/track/example5',
          youtube: 'https://youtube.com/watch?v=example5',
          soundcloud: 'https://soundcloud.com/bangobongo/futuristic-pulse'
        }),
        play_count: 712,
        like_count: 54,
        download_count: 16
      }
    ]

    // Insert sample tracks
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO music (
        id, title, artist, album, genre, release_date, duration, track_number,
        audio_url, preview_url, cover_art, lyrics, is_published, is_featured,
        price, crypto_price, streaming_links, play_count, like_count, download_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    let insertedCount = 0
    for (const track of sampleTracks) {
      try {
        insertStmt.run(
          track.id, track.title, track.artist, track.album, track.genre,
          track.release_date, track.duration, track.track_number,
          track.audio_url, track.preview_url, track.cover_art, track.lyrics,
          track.is_published, track.is_featured, track.price, track.crypto_price,
          track.streaming_links, track.play_count, track.like_count, track.download_count
        )
        insertedCount++
      } catch (error) {
        console.log(`Failed to insert track: ${track.title}`, error)
      }
    }

    return successResponse({
      success: true,
      inserted: insertedCount,
      total: sampleTracks.length,
      tracks: sampleTracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        album: t.album,
        duration: t.duration
      })),
      message: `Successfully added ${insertedCount} sample BangoBongo tracks to your music library!`,
      nextSteps: [
        '🎵 Visit /music to see your tracks',
        '🎧 Test the music player with Web Audio API',
        '🎛️ Use the 10-band equalizer',
        '⚙️ Access admin panel to manage tracks',
        '🛒 Create matching products in Shopify'
      ]
    })

  } catch (error: any) {
    console.error('Add sample music error:', error)
    return errorResponse(`Failed to add sample music: ${error.message}`, 500)
  }
}

// GET: List current music tracks
export async function GET(request: NextRequest) {
  try {
    const db = getDatabase()
    
    const tracks = db.prepare(`
      SELECT 
        id, title, artist, album, genre, release_date, duration, 
        audio_url, preview_url, cover_art, is_published, is_featured,
        price, crypto_price, play_count, like_count, download_count
      FROM music 
      ORDER BY is_featured DESC, play_count DESC, created_at DESC
    `).all() as any[]

    const stats = {
      total: tracks.length,
      published: tracks.filter(t => t.is_published).length,
      featured: tracks.filter(t => t.is_featured).length,
      totalPlays: tracks.reduce((sum, t) => sum + (t.play_count || 0), 0),
      totalLikes: tracks.reduce((sum, t) => sum + (t.like_count || 0), 0)
    }

    return successResponse({
      tracks: tracks.map(track => ({
        ...track,
        isPublished: !!track.is_published,
        isFeatured: !!track.is_featured,
        audioUrl: track.audio_url,
        previewUrl: track.preview_url,
        coverArt: track.cover_art,
        releaseDate: track.release_date,
        playCount: track.play_count,
        likeCount: track.like_count,
        downloadCount: track.download_count,
        cryptoPrice: track.crypto_price
      })),
      stats
    })

  } catch (error: any) {
    console.error('Get music error:', error)
    return errorResponse(`Failed to get music: ${error.message}`, 500)
  }
}
