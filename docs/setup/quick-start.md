# 🚀 Quick Start Guide

Get BangoBongo up and running in minutes with this comprehensive quick start guide. Experience professional Web Audio API integration, 10-band equalizer, and seamless Shopify e-commerce in under 5 minutes!

## 🌟 What You'll Get

- **🎧 Professional Music Player**: Web Audio API with 10-band equalizer
- **🛒 E-commerce Integration**: Shopify API with intelligent fallback
- **🎛️ Audio Processing**: Real-time frequency control and effects
- **📱 Responsive Design**: Works perfectly on all devices
- **💎 High-Quality Audio**: 320kbps MP3 support with gain nodes
- **🎨 Modern UI**: Loading states, buffer visualization, and smooth animations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+**: [Download here](https://nodejs.org/)
- **pnpm**: Package manager (faster than npm)
  ```bash
  npm install -g pnpm
  ```
- **Git**: Version control system

## ⚡ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bangobongo.git
cd bangobongo
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Environment (Optional)
For Shopify integration, copy the environment template:
```bash
cp docs/setup/shopify-setup.env .env.local
```

Edit `.env.local` with your Shopify credentials:
```env
SHOPIFY_DOMAIN=your-shop-name
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
```

> **Note**: Shopify is optional. The app includes high-quality fallback products for testing.

### 4. Initialize Database
```bash
pnpm run db:init
```

### 5. Start Development Server
```bash
pnpm dev
```

The application will be available at: **http://localhost:3001**

## 🎵 Adding Music

### Audio File Requirements
- **Format**: MP3
- **Bitrate**: 320kbps (recommended)
- **Sample Rate**: 44.1kHz
- **Channels**: Stereo

### Adding Tracks
1. Place MP3 files in `/public/audio/`
2. Use naming convention: `{track-id}.mp3`
3. Update track metadata in `/contexts/audio-context.tsx`

Example:
```typescript
{
  id: "my-new-track",
  title: "My New Track",
  duration: 215, // seconds
  albumArt: "/album-art.jpg",
  artist: "BangoBongo",
  audioUrl: "/audio/my-new-track.mp3",
  genre: "Electronic",
  bpm: 128,
  key: "Am",
  year: 2024,
}
```

## 🛒 E-commerce Setup

### Using Fallback Products (Default)
The app includes professional demo products that work immediately:
- BangoBongo Electronic Dreams Hoodie
- Digital Dreams Limited Edition Vinyl
- Studio Headphones Pro
- Concert Posters and Merchandise

### Shopify Integration (Optional)
1. **Create Shopify Private App**:
   - Go to Shopify Admin → Settings → Apps and sales channels → Develop apps
   - Create new app with Storefront API access

2. **Set Permissions**:
   - Read products and their variants
   - Read collections
   - Read product listings

3. **Configure Environment**:
   ```env
   SHOPIFY_DOMAIN=your-shop-name
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_your_token_here
   ```

4. **Test Integration**:
   ```bash
   curl http://localhost:3001/api/shopify/products
   ```

## 🎮 Testing the Application

### 🎵 Music Player (Enhanced with Web Audio API)
Visit: http://localhost:3001/music
- **Audio Quality**: Test high-quality 320kbps playback
- **10-Band Equalizer**: Adjust frequencies from 32Hz to 16kHz
- **Player Modes**: Switch between floating, thin, and full modes
- **Loading States**: Watch real-time buffer progress and quality indicators
- **Advanced Controls**: Test crossfading, repeat, shuffle, and queue management
- **Visual Feedback**: See loading spinners and buffer visualization

### 🛍️ E-commerce (Shopify Integration)
Visit: http://localhost:3001/merch
- **Product Catalog**: Browse 6 high-quality demo products
- **Intelligent Filtering**: Test category, featured, and search filters
- **Product Variants**: Check sizes, colors, and pricing options
- **Crypto Pricing**: View Bitcoin equivalent pricing
- **Professional UI**: Experience smooth loading states and animations

### API Endpoints
Test the APIs:
```bash
# Products API (tries Shopify first, falls back to local)
curl http://localhost:3001/api/products

# Direct Shopify API
curl http://localhost:3001/api/shopify/products

# Force local products
curl http://localhost:3001/api/products?local=true
```

## 🔧 Configuration Options

### Music Player Settings
Edit `/contexts/audio-context.tsx`:
```typescript
// Default volume (0-100)
const [volume, setVolume] = useState<number>(80)

// Crossfade time (seconds)
const [crossfadeTime, setCrossfadeTime] = useState<number>(3)

// Default player mode
const [playerMode, setPlayerMode] = useState<PlayerMode>("thin")
```

### Audio Quality Settings
In `/public/audio/README.md`, you'll find specifications for optimal audio quality:
- **Recommended**: MP3 320kbps CBR, 44.1kHz, Stereo
- **Minimum**: MP3 192kbps, 44.1kHz
- **Maximum File Size**: 10MB per track

### Theme Configuration
Edit `tailwind.config.js` for custom theming:
```javascript
theme: {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
      // Add custom colors
    }
  }
}
```

## 🎯 Key Features to Test

### 1. 🎧 Professional Music Player (Web Audio API)
- ✅ **High-Quality Playback**: 320kbps MP3 with Web Audio API processing
- ✅ **10-Band Graphic Equalizer**: Professional frequency control (32Hz - 16kHz)
- ✅ **Real-time Audio Analysis**: Buffer monitoring and quality indicators
- ✅ **Advanced Volume Control**: Gain-based volume with mute functionality
- ✅ **Multiple Player Modes**: Floating, thin, and full-screen interfaces
- ✅ **Queue Management**: Add, remove, and reorder tracks
- ✅ **Loading States**: Visual feedback for audio loading and buffering
- ✅ **Crossfading**: Smooth transitions between tracks (foundation)

### 2. 🛒 Shopify E-commerce Integration
- ✅ **Live Product Sync**: Real-time Shopify Storefront API integration
- ✅ **Intelligent Fallback**: High-quality demo products when Shopify unavailable
- ✅ **Advanced Filtering**: Category, featured, limited edition, and search
- ✅ **Product Variants**: Complete size, color, and option management
- ✅ **Crypto Pricing**: Bitcoin equivalent pricing display
- ✅ **Professional UI**: Loading states and smooth animations

### 3. 🎛️ Audio Processing Chain
- ✅ **Web Audio API Integration**: Professional audio processing pipeline
- ✅ **Gain Node Control**: High-quality volume and gain management
- ✅ **Biquad Filter Array**: 10-band equalizer with proper Q values
- ✅ **Analyser Node**: Real-time frequency analysis
- ✅ **Buffer Monitoring**: Live buffering progress tracking
- ✅ **Quality Detection**: Automatic audio format and quality detection

## 🐛 Troubleshooting

### Common Issues

**1. Audio Not Playing**
- Check browser Web Audio API support
- Verify audio file format (MP3)
- Check file paths in `/public/audio/`

**2. Shopify Products Not Loading**
- Verify environment variables
- Check Shopify API token permissions
- Test with fallback products: `?local=true`

**3. Development Server Issues**
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Check port 3001 availability
- Verify Node.js version (18+)

**4. Database Issues**
- Reinitialize database: `pnpm run db:init`
- Check SQLite permissions
- Verify schema in `/lib/db/schema.sql`

### Performance Tips

**1. Audio Optimization**
- Use 320kbps MP3 files for best quality
- Keep files under 10MB
- Consider CDN for production

**2. Image Optimization**
- Use Next.js Image component
- Provide alt text for accessibility
- Optimize album art (500x500px recommended)

**3. API Performance**
- Enable Shopify caching in production
- Monitor API rate limits
- Use pagination for large product catalogs

## 📱 Mobile Testing

Test responsive design:
```bash
# Open in mobile viewport
# Chrome DevTools → Toggle device toolbar
# Test various screen sizes
```

Key mobile features:
- Touch-friendly controls
- Responsive equalizer
- Mobile player modes
- Gesture support

## 🚀 Next Steps

After successful setup:

1. **Customize Content**:
   - Add your music tracks
   - Configure your Shopify store
   - Customize themes and branding

2. **Production Deployment**:
   - See [deployment guide](../deployment.md)
   - Configure production environment
   - Set up CDN for audio files

3. **Advanced Features**:
   - Explore [audio processing guide](../features/audio-processing.md)
   - Review [API documentation](../api/README.md)
   - Check [component library](../components.md)

## 💡 Tips for Success

- **Start Simple**: Use fallback products first, add Shopify later
- **Test Audio**: Verify audio quality and format compatibility
- **Mobile First**: Test on mobile devices early and often
- **Performance**: Monitor Web Audio API memory usage
- **Documentation**: Keep track of customizations for team members

---

🎉 **Congratulations!** You now have a fully functional music platform with e-commerce integration. Enjoy building your music empire with BangoBongo!
