import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api-response'
import { getDatabase } from '@/lib/db'

// Create demo tracks with working generated audio URLs
export async function GET(request: NextRequest) {
  try {
    console.log('Setting up demo music tracks with working audio...')

    const db = getDatabase()

    // Clear existing test tracks
    db.prepare('DELETE FROM music WHERE title LIKE ?').run('%Demo Track%')

    // Create demo tracks with data URLs for small generated audio
    const demoTracks = [
      {
        id: 'demo-track-1',
        title: 'Demo Track 1 - Electronic Beat',
        artist: 'BangoBongo',
        album: 'Demo Album',
        genre: 'Electronic',
        release_date: '2024-01-15',
        duration: 180, // 3 minutes
        track_number: 1,
        audio_url: generateSilentAudioDataURL(180), // 3 minutes of silence for testing
        preview_url: null,
        cover_art: '/abstract-electronic-album-art.png',
        lyrics: null,
        is_published: true,
        is_featured: true,
        price: 2.99,
        crypto_price: 0.001,
        streaming_links: JSON.stringify({
          spotify: 'https://open.spotify.com/track/demo1',
          apple: 'https://music.apple.com/demo1'
        }),
        play_count: 1250,
        like_count: 89,
        download_count: 45
      },
      {
        id: 'demo-track-2', 
        title: 'Demo Track 2 - Ambient Vibes',
        artist: 'BangoBongo',
        album: 'Demo Album',
        genre: 'Ambient',
        release_date: '2024-02-20',
        duration: 240, // 4 minutes
        track_number: 2,
        audio_url: generateSilentAudioDataURL(240), // 4 minutes of silence for testing
        preview_url: null,
        cover_art: '/synthwave-album-art.png',
        lyrics: null,
        is_published: true,
        is_featured: false,
        price: 1.99,
        crypto_price: 0.0008,
        streaming_links: JSON.stringify({
          spotify: 'https://open.spotify.com/track/demo2',
          apple: 'https://music.apple.com/demo2'
        }),
        play_count: 890,
        like_count: 67,
        download_count: 23
      },
      {
        id: 'demo-track-3',
        title: 'Demo Track 3 - Future Bass',
        artist: 'BangoBongo',
        album: 'Demo Album',
        genre: 'Bass',
        release_date: '2024-03-10',
        duration: 210, // 3.5 minutes
        track_number: 3,
        audio_url: generateSilentAudioDataURL(210), // 3.5 minutes of silence for testing
        preview_url: null,
        cover_art: '/futuristic-electronic-album-art.png',
        lyrics: null,
        is_published: true,
        is_featured: true,
        price: 3.99,
        crypto_price: 0.0015,
        streaming_links: JSON.stringify({
          spotify: 'https://open.spotify.com/track/demo3',
          apple: 'https://music.apple.com/demo3'
        }),
        play_count: 2100,
        like_count: 156,
        download_count: 78
      }
    ]

    // Insert demo tracks into database
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO music (
        id, title, artist, album, genre, release_date, duration, track_number,
        audio_url, preview_url, cover_art, lyrics, is_published, is_featured,
        price, crypto_price, streaming_links, play_count, like_count, download_count,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        datetime('now'), datetime('now')
      )
    `)

    for (const track of demoTracks) {
      insertStmt.run(
        track.id, track.title, track.artist, track.album, track.genre,
        track.release_date, track.duration, track.track_number,
        track.audio_url, track.preview_url, track.cover_art, track.lyrics,
        track.is_published, track.is_featured, track.price, track.crypto_price,
        track.streaming_links, track.play_count, track.like_count, track.download_count
      )
    }

    console.log(`✅ Successfully created ${demoTracks.length} demo tracks with working audio`)

    return successResponse({
      message: 'Demo tracks with working audio created successfully',
      tracks: demoTracks.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        hasAudio: !!track.audio_url,
        audioType: 'Generated silence for testing'
      })),
      count: demoTracks.length,
      note: 'These tracks use generated silent audio for demonstration purposes'
    })

  } catch (error: any) {
    console.error('Demo music setup error:', error)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Generate a silent audio data URL for testing purposes
function generateSilentAudioDataURL(durationSeconds: number): string {
  // Create a minimal WAV file header for silent audio
  const sampleRate = 44100
  const samples = sampleRate * durationSeconds
  const bytesPerSample = 2
  const channels = 1
  
  const dataSize = samples * bytesPerSample * channels
  const fileSize = 44 + dataSize
  
  // Create WAV header
  const buffer = new ArrayBuffer(44)
  const view = new DataView(buffer)
  
  // WAV file header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
  
  writeString(0, 'RIFF')
  view.setUint32(4, fileSize - 8, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // fmt chunk size
  view.setUint16(20, 1, true) // PCM format
  view.setUint16(22, channels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * channels * bytesPerSample, true)
  view.setUint16(32, channels * bytesPerSample, true)
  view.setUint16(34, 16, true) // bits per sample
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)
  
  // Convert to base64
  const headerBytes = new Uint8Array(buffer)
  const silentData = new Uint8Array(dataSize) // All zeros = silence
  
  // Combine header and data
  const fullData = new Uint8Array(headerBytes.length + silentData.length)
  fullData.set(headerBytes)
  fullData.set(silentData, headerBytes.length)
  
  // Convert to base64 string
  let binaryString = ''
  for (let i = 0; i < fullData.length; i++) {
    binaryString += String.fromCharCode(fullData[i])
  }
  
  return 'data:audio/wav;base64,' + btoa(binaryString)
}
