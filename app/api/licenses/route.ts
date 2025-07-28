import { NextRequest, NextResponse } from 'next/server'

// License tier definitions matching BeatStars model
export const LICENSE_TIERS: Record<string, any> = {
  basic: {
    type: 'basic',
    name: 'Basic Lease',
    price: 29,
    originalPrice: 35,
    description: 'Perfect for independent artists starting out',
    rights: {
      streams: 2500,
      downloads: 2500,
      distribution: false,
      commercialUse: true,
      syncRights: false,
      exclusivity: false,
      modificationRights: false,
      resaleRights: false,
      radioBroadcast: false,
      musicVideos: 1
    },
    leasePeriod: '2 years',
    features: [
      'Up to 2,500 streams',
      'Up to 2,500 downloads/sales',
      '1 music video',
      'Non-exclusive rights',
      'Producer tag required',
      'No distribution to major platforms',
      '2-year lease term'
    ]
  },
  premium: {
    type: 'premium',
    name: 'Premium Lease',
    price: 59,
    originalPrice: 75,
    description: 'Most popular choice for serious artists',
    rights: {
      streams: 10000,
      downloads: 10000,
      distribution: true,
      commercialUse: true,
      syncRights: false,
      exclusivity: false,
      modificationRights: true,
      resaleRights: false,
      radioBroadcast: true,
      musicVideos: 2
    },
    leasePeriod: '3 years',
    popular: true,
    features: [
      'Up to 10,000 streams',
      'Up to 10,000 downloads/sales',
      '2 music videos',
      'Distribution to streaming platforms',
      'Radio broadcast rights',
      'Non-exclusive rights',
      'Producer tag required',
      '3-year lease term'
    ]
  },
  unlimited: {
    type: 'unlimited',
    name: 'Unlimited Lease',
    price: 199,
    originalPrice: 250,
    description: 'No limits on streams or sales',
    rights: {
      streams: 'unlimited',
      downloads: 'unlimited',
      distribution: true,
      commercialUse: true,
      syncRights: true,
      exclusivity: false,
      modificationRights: true,
      resaleRights: false,
      radioBroadcast: true,
      musicVideos: 'unlimited'
    },
    leasePeriod: 'Lifetime',
    features: [
      'Unlimited streams',
      'Unlimited downloads/sales',
      'Unlimited music videos',
      'Full distribution rights',
      'Radio & TV broadcast rights',
      'Sync licensing rights',
      'Non-exclusive rights',
      'Producer tag required',
      'Lifetime lease'
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      tiers: LICENSE_TIERS
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch license tiers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trackId, licenseType, customerId } = body

    // Validate license type
    if (!LICENSE_TIERS[licenseType]) {
      return NextResponse.json(
        { success: false, error: 'Invalid license type' },
        { status: 400 }
      )
    }

    // TODO: Implement license purchase logic
    // 1. Verify track exists and is available for licensing
    // 2. Process payment
    // 3. Create license record
    // 4. Generate license agreement
    // 5. Send confirmation email with license details
    // 6. If exclusive license, remove track from public store

    const license = {
      id: `lic_${Date.now()}`,
      trackId,
      licenseType,
      customerId,
      price: LICENSE_TIERS[licenseType].price,
      purchaseDate: new Date().toISOString(),
      expiryDate: licenseType === 'exclusive' ? null : calculateExpiryDate(licenseType),
      usageRights: LICENSE_TIERS[licenseType].rights,
      creditRequired: licenseType !== 'exclusive',
      isActive: true,
      downloadCount: 0,
      streamCount: 0,
      contractTerms: generateContractTerms(licenseType)
    }

    return NextResponse.json({
      success: true,
      license,
      downloadUrl: `${process.env.NEXTAUTH_URL}/api/licenses/${license.id}/download`,
      contractUrl: `${process.env.NEXTAUTH_URL}/api/licenses/${license.id}/contract`
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process license purchase' },
      { status: 500 }
    )
  }
}

function calculateExpiryDate(licenseType: string): string {
  const now = new Date()
  switch (licenseType) {
    case 'basic':
      return new Date(now.setFullYear(now.getFullYear() + 2)).toISOString()
    case 'premium':
      return new Date(now.setFullYear(now.getFullYear() + 3)).toISOString()
    case 'trackout':
      return new Date(now.setFullYear(now.getFullYear() + 5)).toISOString()
    case 'unlimited':
      return new Date(now.setFullYear(now.getFullYear() + 99)).toISOString() // Lifetime
    default:
      return new Date(now.setFullYear(now.getFullYear() + 2)).toISOString()
  }
}

function generateContractTerms(licenseType: string): string {
  // TODO: Generate proper legal contract terms based on license type
  return `BangoBongo ${LICENSE_TIERS[licenseType].name} - Standard Terms and Conditions`
}
