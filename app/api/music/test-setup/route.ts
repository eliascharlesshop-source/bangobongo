import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// Test music player functionality without external audio dependencies
export async function GET(request: NextRequest) {
  try {
    const db = getDatabase()
    const { v4: uuidv4 } = require('uuid')

    // Clear existing test tracks
    db.prepare('DELETE FROM music WHERE title LIKE ?').run('%Test Track%')

    // Create test tracks with no audio (testing UI only)
    const testTracks = [
      {
        id: uuidv4(),
        title: 'Test Track 1 - Digital Pulse',
        artist: 'BangoBongo',
        album: 'Test Album',
        genre: 'Electronic',
        release_date: '2024-12-01',
        duration: 180,
        track_number: 1,
        audio_url: null, // No audio for testing UI only
        preview_url: null,
        cover_art: '/abstract-electronic-album-art.png',
        lyrics: 'Test track for music player UI testing',
        is_published: 1,
        is_featured: 1,
        price: 2.99,
        crypto_price: 0.000039,
        streaming_links: JSON.stringify({
          spotify: 'https://open.spotify.com/track/test1',
          youtube: 'https://youtube.com/watch?v=test1'
        }),
        play_count: 100,
        like_count: 10,
        download_count: 5
      },
      {
        id: uuidv4(),
        title: 'Test Track 2 - Neon Dreams',
        artist: 'BangoBongo',
        album: 'Test Album',
        genre: 'Synthwave',
        release_date: '2024-12-01',
        duration: 240,
        track_number: 2,
        audio_url: null,
        preview_url: null,
        cover_art: '/synthwave-album-art.png',
        lyrics: 'Another test track for UI validation',
        is_published: 1,
        is_featured: 0,
        price: 2.99,
        crypto_price: 0.000039,
        streaming_links: JSON.stringify({
          spotify: 'https://open.spotify.com/track/test2',
          youtube: 'https://youtube.com/watch?v=test2'
        }),
        play_count: 75,
        like_count: 8,
        download_count: 3
      }
    ]

    // Insert test tracks
    const insertStmt = db.prepare(`
      INSERT INTO music (
        id, title, artist, album, genre, release_date, duration, track_number,
        audio_url, preview_url, cover_art, lyrics, is_published, is_featured,
        price, crypto_price, streaming_links, play_count, like_count, download_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    let insertedCount = 0
    for (const track of testTracks) {
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
      total: testTracks.length,
      tracks: testTracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        duration: t.duration,
        audioUrl: t.audio_url
      })),
      message: `Added ${insertedCount} test tracks for UI testing (no audio files needed)`,
      notes: [
        '✅ Music player UI can be tested without audio files',
        '🎛️ Equalizer controls will be available',
        '🔊 Audio loading errors resolved (no external dependencies)',
        '⚙️ Perfect for demonstrating the interface',
        '📝 Ready to replace with real audio when available'
      ]
    })

  } catch (error: any) {
    console.error('Music player test setup error:', error)
    return errorResponse(`Failed to setup music player test: ${error.message}`, 500)
  }
}
