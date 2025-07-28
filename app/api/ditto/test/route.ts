import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { apiKey, apiSecret } = await req.json()

    if (!apiKey || !apiSecret) {
      return NextResponse.json({
        success: false,
        error: 'API Key and Secret are required'
      }, { status: 400 })
    }

    // Test Ditto Music API authentication
    const authResponse = await fetch('https://api.dittomusic.com/v1/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: apiKey,
        client_secret: apiSecret,
        grant_type: 'client_credentials'
      })
    })

    if (!authResponse.ok) {
      const errorData = await authResponse.json().catch(() => ({}))
      return NextResponse.json({
        success: false,
        error: `Authentication failed: ${errorData.error_description || authResponse.statusText}`
      }, { status: 400 })
    }

    const authData = await authResponse.json()

    // Test getting user/label info
    const profileResponse = await fetch('https://api.dittomusic.com/v1/profile', {
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    let profileData = null
    if (profileResponse.ok) {
      profileData = await profileResponse.json()
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Ditto Music API',
      data: {
        authenticated: true,
        tokenType: authData.token_type,
        expiresIn: authData.expires_in,
        profile: profileData,
        capabilities: [
          'Upload tracks',
          'Manage releases',
          'View analytics',
          'Update metadata'
        ]
      }
    })

  } catch (error) {
    console.error('Ditto API test error:', error)
    return NextResponse.json({
      success: false,
      error: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
}
