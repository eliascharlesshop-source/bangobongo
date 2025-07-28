# BangoBongo Music Player & E-commerce Integration

## 🎵 Enhanced Music Player Features

The BangoBongo app now includes a professional-grade music player with Web Audio API integration and high-quality audio processing.

### Core Features

- **Web Audio API Integration**: Professional audio processing with gain nodes, analyser nodes, and filter chains
- **10-Band Equalizer**: Full spectrum audio control with frequency ranges from 32Hz to 16kHz
- **High-Quality Audio Support**: Optimized for 320kbps MP3 files at 44.1kHz sample rate
- **Real-time Audio Analysis**: Buffer monitoring, loading states, and audio quality indicators
- **Advanced Player Modes**: Floating, thin, and full player modes with smooth animations
- **Queue Management**: Add, remove, and reorder tracks in the playback queue
- **Crossfading**: Smooth transitions between tracks (Web Audio API)
- **Professional Volume Control**: Gain-based volume with mute functionality

### Audio Quality Specifications

- **Format**: MP3 320kbps, 44.1kHz
- **Channels**: Stereo
- **Audio Processing**: Web Audio API with gain nodes
- **Equalizer**: 10-band graphic equalizer
- **Buffer Monitoring**: Real-time buffering visualization

### Components

#### 1. AudioProvider Context (`/contexts/audio-context.tsx`)
Central audio management system with Web Audio API integration:
- Web Audio API initialization and management
- Professional audio processing chain
- Equalizer with 10 frequency bands
- Loading states and buffer monitoring
- High-quality volume control with gain nodes

#### 2. FixedMediaPlayer (`/components/fixed-media-player.tsx`)
Advanced floating music player with multiple display modes:
- **Floating Mode**: Draggable compact player
- **Thin Mode**: Minimal bottom bar player
- **Full Mode**: Expanded player with all controls
- Queue management interface
- Real-time loading and buffer indicators
- Audio quality display

#### 3. MusicPlayer (`/components/music-player.tsx`)
Enhanced standalone music player component:
- Web Audio API integration
- Optional equalizer controls
- Loading states and buffer visualization
- Audio quality indicators
- Professional volume control

### Audio Files

Audio files should be placed in `/public/audio/` directory with the following specifications:
- **Format**: MP3
- **Bitrate**: 320kbps (CBR recommended)
- **Sample Rate**: 44.1kHz
- **Channels**: Stereo
- **Naming**: `{track-id}.mp3`

Example tracks included:
- `neon-pulse.mp3`
- `digital-dreams.mp3`
- `midnight-echo.mp3`
- `cyber-horizons.mp3`
- `synthwave-paradise.mp3`

### Usage Examples

```tsx
// Basic music player
import MusicPlayer from '@/components/music-player'

<MusicPlayer tracks={tracks} showAdvancedControls={true} />

// Using the audio context
import { useAudio } from '@/contexts/audio-context'

const { 
  currentTrack, 
  isPlaying, 
  togglePlayPause,
  equalizerSettings,
  updateEqualizer,
  audioQuality 
} = useAudio()
```

## 🛒 Shopify E-commerce Integration

### Features

- **Real Shopify Integration**: Fetches products from your Shopify store via Storefront API
- **Fallback System**: Graceful fallback to local products if Shopify is unavailable
- **Product Variants**: Support for sizes, colors, and variants
- **Category Filtering**: Filter by product type, featured, limited edition
- **Search Functionality**: Full-text search across products
- **Crypto Pricing**: Bitcoin equivalent pricing display

### Setup Instructions

1. **Create Shopify Private App**:
   - Go to your Shopify Admin → Settings → Apps and sales channels → Develop apps
   - Create a new app with Storefront API access
   - Enable these permissions:
     - Read products and their variants
     - Read collections
     - Read product listings

2. **Configure Environment Variables**:
   ```bash
   cp .env.shopify.example .env.local
   ```
   
   Add your Shopify credentials to `.env.local`:
   ```env
   SHOPIFY_DOMAIN=your-shop-name
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
   ```

3. **Product Requirements**:
   - Products should have appropriate tags: `featured`, `limited-edition`, `sale`
   - Product types should match your categories: `Merchandise`, `Vinyl`, `Gear`, etc.
   - High-quality product images recommended

### API Endpoints

#### Shopify Products API
```
GET /api/shopify/products
```

Query Parameters:
- `category` - Filter by product type
- `featured=true` - Show only featured products
- `limited=true` - Show only limited edition products
- `search` - Full-text search
- `limit` - Number of products to return (default: 20)

#### Unified Products API
```
GET /api/products
```

Automatically tries Shopify first, falls back to local database if needed:
- `local=true` - Force use of local products only
- All other parameters passed through to Shopify API

### Example Response

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "bangobongo-hoodie-001",
        "name": "BangoBongo Electronic Dreams Hoodie",
        "price": 65.00,
        "cryptoPrice": 0.00085,
        "description": "Premium quality hoodie...",
        "category": "Merchandise",
        "imageUrl": "/merch/bangobongo-hoodie.jpg",
        "images": [...],
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Black", "Navy", "Charcoal"],
        "tags": ["hoodie", "merchandise", "electronic"],
        "inStock": true,
        "isFeatured": true,
        "isLimited": false,
        "inventory": 25
      }
    ],
    "source": "shopify",
    "total": 1
  }
}
```

### Fallback Products

If Shopify is not configured or fails, the system includes high-quality fallback products:
- BangoBongo Electronic Dreams Hoodie
- Digital Dreams Limited Edition Vinyl
- BangoBongo Classic Logo T-Shirt
- BangoBongo Studio Headphones Pro
- Neon Nights Concert Poster
- Synthwave Sticker Pack

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure Shopify** (Optional):
   ```bash
   cp .env.shopify.example .env.local
   # Add your Shopify credentials
   ```

3. **Add Audio Files**:
   Place your high-quality MP3 files in `/public/audio/`

4. **Start Development Server**:
   ```bash
   pnpm dev
   ```

5. **Test Music Player**:
   - Visit any page with the music player
   - Try different player modes (floating, thin, full)
   - Test equalizer controls
   - Check loading states and buffer indicators

6. **Test E-commerce**:
   - Visit `/merch` or `/gear` pages
   - Verify products load from Shopify or fallback
   - Test filtering and search functionality

## 🎛️ Technical Architecture

### Web Audio API Processing Chain

```
Audio Source → Gain Node → Equalizer Filters → Main Gain → Analyser → Destination
```

- **Source**: HTML5 Audio element
- **Input Gain**: Pre-equalizer volume control
- **Equalizer**: 10 biquad filters (32Hz - 16kHz)
- **Main Gain**: Post-equalizer volume control
- **Analyser**: Real-time frequency analysis
- **Destination**: Audio output

### Equalizer Frequency Bands

| Band | Frequency | Type |
|------|-----------|------|
| 1 | 32Hz | lowshelf |
| 2 | 64Hz | peaking |
| 3 | 125Hz | peaking |
| 4 | 250Hz | peaking |
| 5 | 500Hz | peaking |
| 6 | 1kHz | peaking |
| 7 | 2kHz | peaking |
| 8 | 4kHz | peaking |
| 9 | 8kHz | peaking |
| 10 | 16kHz | highshelf |

### State Management

The audio context manages all player state including:
- Current track and playlist
- Play/pause/seek state
- Volume and mute state
- Repeat and shuffle modes
- Equalizer settings
- Loading and buffer states
- Player mode preferences

## 🔧 Customization

### Adding New Audio Effects

Extend the Web Audio API chain in `audio-context.tsx`:

```tsx
// Add reverb effect
const reverbNode = audioContext.createConvolver()
// Insert into processing chain
inputGainNode.connect(reverbNode)
reverbNode.connect(equalizerFilters[0])
```

### Custom Equalizer Presets

Add preset configurations:

```tsx
const presets = {
  rock: { '32': 3, '64': 2, '125': -1, '250': -2, '500': 1, '1000': 2, '2000': 4, '4000': 3, '8000': 2, '16000': 1 },
  electronic: { '32': 4, '64': 3, '125': 1, '250': 0, '500': -1, '1000': 0, '2000': 2, '4000': 3, '8000': 4, '16000': 3 }
}
```

### Shopify Product Transformation

Customize product data transformation in `/api/shopify/products/route.ts`:

```tsx
function transformShopifyProduct(shopifyProduct) {
  // Add custom fields
  // Transform pricing
  // Handle variants
}
```

## 📱 Mobile Responsiveness

The music player includes mobile-optimized features:
- Touch-friendly controls
- Responsive equalizer layout
- Optimized player modes for mobile
- Gesture support for seeking and volume

## 🎨 Theming

The player respects your Tailwind CSS theme:
- Uses CSS custom properties for colors
- Adapts to dark/light mode
- Customizable via Tailwind configuration

## 🔍 Troubleshooting

### Audio Issues
- Ensure audio files are in MP3 format, 320kbps
- Check browser Web Audio API support
- Verify file paths and CORS settings

### Shopify Issues
- Verify Storefront API token permissions
- Check domain configuration
- Review API rate limits
- Test with fallback products using `?local=true`

### Performance
- Audio files should be optimized for web
- Consider CDN for audio file delivery
- Monitor memory usage with Web Audio API

## 📄 License

This project is part of the BangoBongo music platform.
