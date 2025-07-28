import { NextRequest, NextResponse } from 'next/server'

// Ditto Music API client configuration
const DITTO_CONFIG = {
  baseUrl: process.env.DITTO_BASE_URL || 'https://api.dittomusic.com/v1',
  apiKey: process.env.DITTO_API_KEY,
  apiSecret: process.env.DITTO_API_SECRET,
  artistId: process.env.DITTO_ARTIST_ID
}

class DittoMusicClient {
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  async authenticate(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch(`${DITTO_CONFIG.baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: DITTO_CONFIG.apiKey,
          client_secret: DITTO_CONFIG.apiSecret,
          grant_type: 'client_credentials'
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`Authentication failed: ${data.error}`)
      }

      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1 min early

      if (!this.accessToken) {
        throw new Error('No access token received from Ditto')
      }

      return this.accessToken
    } catch (error) {
      throw new Error(`Failed to authenticate with Ditto: ${error}`)
    }
  }

  async createRelease(trackData: any) {
    const token = await this.authenticate()

    try {
      const response = await fetch(`${DITTO_CONFIG.baseUrl}/releases`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artist_id: DITTO_CONFIG.artistId,
          release_title: trackData.title,
          release_type: 'single',
          genre: trackData.genre || 'Electronic',
          release_date: trackData.releaseDate || new Date().toISOString().split('T')[0],
          tracks: [{
            title: trackData.title,
            duration: trackData.duration,
            isrc: trackData.isrc,
            explicit: trackData.isExplicit || false,
            audio_file_url: trackData.audioFileUrl,
            preview_start: 30
          }],
          artwork_url: trackData.albumArt,
          primary_genre: trackData.genre || 'Electronic',
          secondary_genre: trackData.secondaryGenre,
          language: 'EN',
          copyright: `© ${new Date().getFullYear()} BangoBongo Music`,
          recording_year: new Date().getFullYear(),
          recording_location: trackData.recordingLocation || 'Studio',
          label_name: 'BangoBongo Music',
          distribution_territories: ['worldwide'],
          platforms: {
            spotify: true,
            apple_music: true,
            amazon_music: true,
            youtube_music: true,
            deezer: true,
            tidal: true,
            pandora: true,
            soundcloud: true,
            bandcamp: false // Keep exclusive to our platform initially
          },
          monetization: {
            content_id: true,
            fingerprinting: true,
            rights_management: true
          }
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(`Release creation failed: ${result.error}`)
      }

      return result
    } catch (error) {
      throw new Error(`Failed to create Ditto release: ${error}`)
    }
  }

  async getReleaseStatus(releaseId: string) {
    const token = await this.authenticate()

    try {
      const response = await fetch(`${DITTO_CONFIG.baseUrl}/releases/${releaseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get release status: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      throw new Error(`Failed to check release status: ${error}`)
    }
  }

  async getAnalytics(releaseId: string, startDate?: string, endDate?: string) {
    const token = await this.authenticate()

    try {
      const params = new URLSearchParams({
        release_id: releaseId,
        start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: endDate || new Date().toISOString().split('T')[0]
      })

      const response = await fetch(`${DITTO_CONFIG.baseUrl}/analytics?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get analytics: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      throw new Error(`Failed to get analytics: ${error}`)
    }
  }
}

const dittoClient = new DittoMusicClient()

// POST: Distribute BangoBongo original to Ditto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trackId, trackData } = body

    // Verify this is a BangoBongo original track
    if (trackData.category !== 'original') {
      return NextResponse.json(
        { success: false, error: 'Only BangoBongo original tracks can be distributed through Ditto' },
        { status: 400 }
      )
    }

    // Create release on Ditto
    const release = await dittoClient.createRelease(trackData)

    // TODO: Update track record with Ditto release ID
    // await updateTrack(trackId, { 
    //   dittoReleaseId: release.id, 
    //   isDistributed: true 
    // })

    return NextResponse.json({
      success: true,
      release,
      message: 'Track successfully submitted to Ditto for distribution'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Distribution failed' },
      { status: 500 }
    )
  }
}

// GET: Check distribution status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const releaseId = searchParams.get('releaseId')
    const trackId = searchParams.get('trackId')

    if (!releaseId && !trackId) {
      return NextResponse.json(
        { success: false, error: 'Either releaseId or trackId is required' },
        { status: 400 }
      )
    }

    let status, analytics

    if (releaseId) {
      status = await dittoClient.getReleaseStatus(releaseId)
      analytics = await dittoClient.getAnalytics(releaseId)
    } else {
      // TODO: Get releaseId from trackId in database
      // const track = await getTrack(trackId)
      // if (track.dittoReleaseId) {
      //   status = await dittoClient.getReleaseStatus(track.dittoReleaseId)
      //   analytics = await dittoClient.getAnalytics(track.dittoReleaseId)
      // }
    }

    return NextResponse.json({
      success: true,
      status,
      analytics
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to get status' },
      { status: 500 }
    )
  }
}
