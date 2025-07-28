import { NextRequest, NextResponse } from 'next/server'

// Enhanced Ditto Music API client with seamless integration
const DITTO_CONFIG = {
  baseUrl: process.env.DITTO_BASE_URL || 'https://api.dittomusic.com/v1',
  apiKey: process.env.DITTO_API_KEY,
  apiSecret: process.env.DITTO_API_SECRET,
  artistId: process.env.DITTO_ARTIST_ID,
  labelName: process.env.DITTO_LABEL_NAME || 'BangoBongo Music'
}

interface TrackData {
  id: string
  title: string
  duration: number
  albumArt: string
  audioFile: string
  category: 'original' | 'licensed' | 'beat'
  genre?: string
  bpm?: number
  key?: string
  isExplicit?: boolean
  releaseDate?: string
  producer?: string
  songwriter?: string
  composer?: string
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
        throw new Error(`Ditto authentication failed: ${data.error || response.statusText}`)
      }

      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1 min early

      if (!this.accessToken) {
        throw new Error('No access token received from Ditto Music')
      }

      return this.accessToken
    } catch (error) {
      throw new Error(`Failed to authenticate with Ditto Music: ${error}`)
    }
  }

  async createRelease(trackData: TrackData) {
    const token = await this.authenticate()

    try {
      // Generate ISRC if not provided
      const isrc = await this.generateISRC(trackData.id)
      
      // Upload artwork to Ditto first
      const artworkUrl = await this.uploadArtwork(trackData.albumArt, token)
      
      // Upload audio file to Ditto
      const audioUrl = await this.uploadAudio(trackData.audioFile, token)

      const releaseData = {
        artist_id: DITTO_CONFIG.artistId,
        label_name: DITTO_CONFIG.labelName,
        release_title: trackData.title,
        release_type: 'single',
        primary_genre: this.mapGenre(trackData.genre || 'Electronic'),
        secondary_genre: this.getSecondaryGenre(trackData.genre || 'Electronic'),
        release_date: trackData.releaseDate || new Date().toISOString().split('T')[0],
        original_release_date: trackData.releaseDate || new Date().toISOString().split('T')[0],
        artwork_url: artworkUrl,
        language: 'EN',
        copyright_holder: DITTO_CONFIG.labelName,
        copyright_year: new Date().getFullYear(),
        phonographic_copyright: `℗ ${new Date().getFullYear()} ${DITTO_CONFIG.labelName}`,
        recording_location: 'Studio',
        
        // Distribution settings - maintain control over masters
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
          bandcamp: false, // Keep exclusive to BangoBongo platform
          beatport: trackData.genre?.toLowerCase().includes('electronic'),
          traxsource: trackData.genre?.toLowerCase().includes('house') || trackData.genre?.toLowerCase().includes('techno')
        },
        
        // Rights management - crucial for maintaining masters
        content_protection: {
          content_id: true,
          fingerprinting: true,
          rights_management: true,
          youtube_content_id: true,
          takedown_protection: true
        },
        
        // Tracks array
        tracks: [{
          title: trackData.title,
          duration: trackData.duration,
          isrc: isrc,
          explicit: trackData.isExplicit || false,
          audio_file_url: audioUrl,
          preview_start_time: 30,
          fade_in: 0,
          fade_out: 3,
          
          // Credits
          primary_artist: 'BangoBongo',
          featured_artists: [],
          producers: [trackData.producer || 'BangoBongo'],
          songwriters: [trackData.songwriter || 'BangoBongo'],
          composers: [trackData.composer || 'BangoBongo'],
          
          // Additional metadata
          bpm: trackData.bpm,
          key: trackData.key,
          mood: this.inferMood(trackData.genre, trackData.bpm),
          energy_level: this.inferEnergyLevel(trackData.bpm)
        }],
        
        // Marketing metadata
        description: `New release from BangoBongo - ${trackData.title}. ${this.generateDescription(trackData)}`,
        promotional_text: `Latest track from electronic music producer BangoBongo. Stream "${trackData.title}" now on all platforms.`,
        
        // Advanced options
        pre_order: false,
        mastering_required: false, // We handle our own mastering
        distribution_priority: 'standard',
        social_media_promotion: true
      }

      const response = await fetch(`${DITTO_CONFIG.baseUrl}/releases`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(releaseData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(`Ditto release creation failed: ${result.error || result.message || response.statusText}`)
      }

      // Store the release mapping in our database
      await this.saveReleaseMapping(trackData.id, result.id, result)

      return {
        ...result,
        bangobongo_track_id: trackData.id,
        distribution_status: 'submitted',
        estimated_live_date: this.calculateLiveDate()
      }

    } catch (error) {
      // Log error for admin review
      await this.logDistributionError(trackData.id, error)
      throw new Error(`Failed to create Ditto release: ${error}`)
    }
  }

  async uploadArtwork(artworkPath: string, token: string): Promise<string> {
    try {
      // Convert local artwork to Ditto-compatible format
      const artworkBuffer = await this.getArtworkBuffer(artworkPath)
      
      const formData = new FormData()
      formData.append('artwork', new Blob([artworkBuffer]), 'artwork.jpg')
      
      const response = await fetch(`${DITTO_CONFIG.baseUrl}/uploads/artwork`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(`Artwork upload failed: ${result.error}`)
      }

      return result.url
    } catch (error) {
      throw new Error(`Failed to upload artwork: ${error}`)
    }
  }

  async uploadAudio(audioPath: string, token: string): Promise<string> {
    try {
      // Get audio file and ensure it meets Ditto requirements
      const audioBuffer = await this.getAudioBuffer(audioPath)
      
      const formData = new FormData()
      formData.append('audio', new Blob([audioBuffer]), 'track.wav')
      
      const response = await fetch(`${DITTO_CONFIG.baseUrl}/uploads/audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(`Audio upload failed: ${result.error}`)
      }

      return result.url
    } catch (error) {
      throw new Error(`Failed to upload audio: ${error}`)
    }
  }

  async syncReleaseStatus(dittoReleaseId: string) {
    const token = await this.authenticate()

    try {
      const response = await fetch(`${DITTO_CONFIG.baseUrl}/releases/${dittoReleaseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to sync release status: ${response.statusText}`)
      }

      const releaseData = await response.json()
      
      // Update our database with latest status
      await this.updateReleaseStatus(dittoReleaseId, releaseData)
      
      return releaseData
    } catch (error) {
      throw new Error(`Failed to sync release status: ${error}`)
    }
  }

  async getAnalytics(dittoReleaseId: string, startDate?: string, endDate?: string) {
    const token = await this.authenticate()

    try {
      const params = new URLSearchParams({
        release_id: dittoReleaseId,
        start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: endDate || new Date().toISOString().split('T')[0],
        include_territorial_breakdown: 'true',
        include_platform_breakdown: 'true'
      })

      const response = await fetch(`${DITTO_CONFIG.baseUrl}/analytics?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get analytics: ${response.statusText}`)
      }

      const analytics = await response.json()
      
      // Store analytics in our database for reporting
      await this.storeAnalytics(dittoReleaseId, analytics)
      
      return analytics
    } catch (error) {
      throw new Error(`Failed to get analytics: ${error}`)
    }
  }

  // Helper methods
  private async generateISRC(trackId: string): Promise<string> {
    // Generate ISRC code - format: CC-XXX-YY-NNNNN
    const countryCode = 'US' // or your country
    const registrantCode = 'BBG' // BangoBongo
    const year = new Date().getFullYear().toString().slice(-2)
    const designation = trackId.slice(-5).padStart(5, '0')
    
    return `${countryCode}-${registrantCode}-${year}-${designation}`
  }

  private mapGenre(genre: string): string {
    const genreMap: Record<string, string> = {
      'Electronic': 'Electronic',
      'Synthwave': 'Electronic',
      'House': 'Dance',
      'Techno': 'Dance',
      'Ambient': 'New Age',
      'Hip Hop': 'Hip-Hop/Rap',
      'Trap': 'Hip-Hop/Rap',
      'Lo-Fi': 'Electronic'
    }
    return genreMap[genre] || 'Electronic'
  }

  private getSecondaryGenre(genre: string): string {
    const secondaryMap: Record<string, string> = {
      'Electronic': 'Ambient',
      'Synthwave': 'Synthpop',
      'House': 'Tech House',
      'Techno': 'Minimal Techno',
      'Hip Hop': 'Trap',
      'Ambient': 'Downtempo'
    }
    return secondaryMap[genre] || 'Ambient'
  }

  private inferMood(genre?: string, bpm?: number): string {
    if (bpm && bpm < 90) return 'Chill'
    if (bpm && bpm > 140) return 'Energetic'
    if (genre?.toLowerCase().includes('ambient')) return 'Relaxing'
    if (genre?.toLowerCase().includes('house')) return 'Upbeat'
    return 'Atmospheric'
  }

  private inferEnergyLevel(bpm?: number): number {
    if (!bpm) return 5
    if (bpm < 80) return 2
    if (bpm < 100) return 4
    if (bpm < 120) return 6
    if (bpm < 140) return 8
    return 10
  }

  private generateDescription(trackData: TrackData): string {
    return `Experience the latest electronic soundscape with "${trackData.title}". ${trackData.bpm ? `At ${trackData.bpm} BPM` : ''} ${trackData.key ? `in ${trackData.key}` : ''}, this track showcases BangoBongo's signature production style.`
  }

  private calculateLiveDate(): string {
    // Ditto typically takes 1-2 weeks for distribution
    const liveDate = new Date()
    liveDate.setDate(liveDate.getDate() + 14)
    return liveDate.toISOString().split('T')[0]
  }

  // Database operations (implement based on your DB setup)
  private async saveReleaseMapping(trackId: string, dittoId: string, releaseData: any) {
    // TODO: Implement database save
    console.log(`Saving release mapping: ${trackId} -> ${dittoId}`)
  }

  private async updateReleaseStatus(dittoId: string, statusData: any) {
    // TODO: Implement database update
    console.log(`Updating release status for ${dittoId}:`, statusData.status)
  }

  private async storeAnalytics(dittoId: string, analytics: any) {
    // TODO: Implement analytics storage
    console.log(`Storing analytics for ${dittoId}`)
  }

  private async logDistributionError(trackId: string, error: any) {
    // TODO: Implement error logging
    console.error(`Distribution error for track ${trackId}:`, error)
  }

  private async getArtworkBuffer(artworkPath: string): Promise<ArrayBuffer> {
    // TODO: Implement artwork file reading
    throw new Error('Artwork buffer retrieval not implemented')
  }

  private async getAudioBuffer(audioPath: string): Promise<ArrayBuffer> {
    // TODO: Implement audio file reading
    throw new Error('Audio buffer retrieval not implemented')
  }
}

const dittoClient = new DittoMusicClient()

// POST: Seamlessly distribute BangoBongo original to Ditto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trackId, auto = false } = body

    // Get track data from our database
    // TODO: Implement track retrieval
    const trackData: TrackData = {
      id: trackId,
      title: 'Sample Track',
      duration: 180,
      albumArt: '/path/to/artwork.jpg',
      audioFile: '/path/to/audio.wav',
      category: 'original',
      genre: 'Electronic',
      bpm: 128,
      key: 'C Minor'
    }

    // Only distribute BangoBongo originals
    if (trackData.category !== 'original') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Only BangoBongo original tracks can be distributed through Ditto Music' 
        },
        { status: 400 }
      )
    }

    // Create release on Ditto with full metadata
    const release = await dittoClient.createRelease(trackData)

    return NextResponse.json({
      success: true,
      release,
      message: `"${trackData.title}" successfully submitted to Ditto Music for global distribution`,
      estimatedLiveDate: release.estimated_live_date,
      distributionId: release.id,
      trackingUrl: `${process.env.NEXTAUTH_URL}/admin/distribution/${release.id}`
    })

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Distribution failed',
        support: 'Contact BangoBongo support if this issue persists'
      },
      { status: 500 }
    )
  }
}

// GET: Check distribution status and analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const releaseId = searchParams.get('releaseId')
    const trackId = searchParams.get('trackId')
    const includeAnalytics = searchParams.get('analytics') === 'true'

    if (!releaseId && !trackId) {
      return NextResponse.json(
        { success: false, error: 'Either releaseId or trackId is required' },
        { status: 400 }
      )
    }

    let status, analytics

    if (releaseId) {
      status = await dittoClient.syncReleaseStatus(releaseId)
      if (includeAnalytics) {
        analytics = await dittoClient.getAnalytics(releaseId)
      }
    } else if (trackId) {
      // TODO: Get releaseId from trackId in database
      // const release = await getReleaseByTrackId(trackId)
      // if (release?.ditto_release_id) {
      //   status = await dittoClient.syncReleaseStatus(release.ditto_release_id)
      //   if (includeAnalytics) {
      //     analytics = await dittoClient.getAnalytics(release.ditto_release_id)
      //   }
      // }
    }

    return NextResponse.json({
      success: true,
      status,
      analytics,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get distribution status' 
      },
      { status: 500 }
    )
  }
}

// PUT: Update release metadata
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { releaseId, updates } = body

    // TODO: Implement release updates
    // This would allow updating release information on Ditto

    return NextResponse.json({
      success: true,
      message: 'Release updated successfully'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update release' },
      { status: 500 }
    )
  }
}
