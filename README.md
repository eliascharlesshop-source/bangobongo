# 🎵 BangoBongo Music Platform

![BangoBongo Logo](public/placeholder-logo.png)

> **Professional Electronic Music Artist Platform** - Experience studio-quality music with Web Audio API integration, 10-band equalizer, and seamless Shopify e-commerce.

## 🌟 Latest Enhancements (July 2025)

### 🎧 **Professional Music Player with Web Audio API**
- **10-Band Graphic Equalizer**: Professional frequency control (32Hz - 16kHz)
- **High-Quality Audio Processing**: 320kbps MP3 support with gain nodes
- **Real-time Visualization**: Buffer progress, loading states, and quality indicators
- **Multiple Player Modes**: Floating, thin, and full-screen interfaces
- **Advanced Controls**: Crossfading, repeat, shuffle, and queue management

### 🛒 **Shopify E-commerce Integration**
- **Live Product Synchronization**: Real-time Shopify Storefront API integration
- **Intelligent Fallback System**: High-quality demo products for seamless experience
- **Cryptocurrency Support**: Bitcoin equivalent pricing for all products
- **Advanced Product Management**: Variants, filtering, search, and inventory tracking

## 🎯 About BangoBongo

BangoBongo is a cutting-edge electronic music platform featuring:

- **🎧 Professional Audio**: Web Audio API with studio-quality processing
- **🎛️ Real-time EQ**: 10-band graphic equalizer with professional controls
- **🎤 Live Performances**: Global tour dates and exclusive live shows  
- **🛍️ E-commerce Integration**: Shopify-powered merchandise store
- **⚙️ Professional Gear**: Equipment reviews and studio setup insights
- **💿 Music Distribution**: High-quality audio streaming and downloads

## 🎧 Professional Audio Features

### �️ Web Audio API Integration
- **10-Band Parametric Equalizer** - Professional frequency control (60Hz - 16kHz)
- **Real-time Audio Analysis** - Visual waveforms and frequency spectrum
- **High-Quality Processing** - 48kHz/24-bit audio pipeline
- **Dynamic Loading States** - Buffer visualization and quality indicators
- **Smooth Animations** - CSS3 transitions for all UI interactions

### 🎵 Music Player Modes
- **Fixed Floating Player** - Persistent mini-player with full controls
- **Standalone Player** - Full-featured player with equalizer
- **Background Playback** - Continuous music across page navigation
- **Quality Badges** - Real-time audio quality indicators

### 🔊 Audio Processing Chain
```
Audio Source → Gain Node → 10-Band EQ → Analyser → Output
```

## 🛒 E-Commerce Platform

### 🏪 Shopify Storefront Integration
- **Real-time Product Sync** - Live inventory from Shopify via GraphQL
- **Intelligent Fallback** - Local demo products when Shopify unavailable  
- **Variant Support** - Size, color, and custom product options
- **Price Management** - Multi-currency with crypto payment options
- **Inventory Tracking** - Real-time stock levels and availability

### 💳 Payment & Orders
- **Stripe Integration** - Secure credit card processing
- **Crypto Payments** - Bitcoin and Ethereum support
- **Order Management** - Full lifecycle tracking
- **Digital Fulfillment** - Instant downloads for beats/tracks
- **Physical Shipping** - Merchandise delivery worldwide

*🛍️ Complete setup guide: [Shopify Integration](./docs/setup/shopify-integration.md)*

*🛍️ Complete setup guide: [Shopify Integration](./docs/setup/shopify-integration.md)*

## 🚀 Platform Features

### 🎵 Professional Music Experience
- **Web Audio API Integration** - Professional audio processing with 10-band parametric EQ
- **High-Quality Streaming** - 48kHz/24-bit audio pipeline for studio-quality sound
- **Real-time Visualization** - Dynamic waveforms and frequency spectrum analysis
- **Smart Loading States** - Buffer visualization and quality indicators
- **Cross-Page Playback** - Persistent music across navigation

### 🛒 Advanced E-Commerce
- **Shopify Integration** - Real-time product sync via Storefront API
- **Intelligent Fallback** - Demo products when Shopify unavailable
- **Multi-variant Support** - Size, color, and custom options
- **Crypto Payments** - Bitcoin and Ethereum alongside traditional methods
- **Real-time Inventory** - Live stock tracking and availability

### 🎪 Event Management
- **Tour Listings** - Comprehensive event details with venue information
- **Ticket Integration** - Direct booking with external platforms
- **VIP Packages** - Premium experience offerings
- **Social Sharing** - Promote events across platforms

### 🔧 Developer Experience
- **TypeScript First** - Complete type safety throughout
- **Hot Module Replacement** - Lightning-fast development
- **Component Library** - Shadcn/UI with custom theming
- **API Documentation** - Comprehensive endpoint references
- **Deployment Ready** - Optimized for Vercel and other platforms

## 🎪 Live Events & Tours

### 📅 Tour Management
- **Event Listings** - Comprehensive tour dates with venue details
- **Ticket Integration** - Direct booking with external platforms
- **Location Services** - Maps integration for venue locations
- **Event Updates** - Real-time notifications for changes
- **VIP Packages** - Premium experience offerings

### 🎫 Fan Engagement
- **Pre-sale Access** - Exclusive early ticket sales
- **Meet & Greet** - Artist interaction opportunities
- **Merchandise Bundles** - Event-specific product packages
- **Social Integration** - Share and promote events


## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component library
- **Lucide React**: Modern icon library
- **Web Audio API**: Professional audio processing

## 📚 Documentation

### 🚀 Quick Start
- **[Quick Start Guide](./docs/setup/quick-start.md)** - Get running in 5 minutes
- **[Installation Guide](./docs/setup/installation.md)** - Detailed setup instructions
- **[Shopify Integration](./docs/setup/shopify-integration.md)** - Connect your store

### 🎵 Music & Audio
- **[Audio Processing Guide](./docs/features/audio-processing.md)** - Web Audio API deep dive
- **[Music Player Features](./docs/features/music-player-complete.md)** - Complete player documentation
- **[Equalizer System](./docs/features/equalizer.md)** - Professional audio control

### 🔌 API Reference
- **[Complete API Documentation](./docs/api/README.md)** - All endpoints and examples
- **[Products API](./docs/api/products.md)** - E-commerce integration
- **[Music API](./docs/api/music.md)** - Audio and playlist management

### 🚀 Deployment & Production
- **[Production Deployment](./docs/deployment/production.md)** - Deploy your platform
- **[Performance Optimization](./docs/deployment/performance.md)** - Optimize for scale
- **[Environment Setup](./docs/deployment/environment.md)** - Production configuration

### 📖 Complete Documentation
👉 **[Browse All Documentation](./docs/README.md)** - Comprehensive guides and references

## 🎯 Quick Demo

Experience the platform features:

1. **🎵 Music Player**: Visit `/music` for professional audio with 10-band EQ
2. **🛒 E-commerce**: Browse `/merch` for Shopify-integrated products  
3. **🎤 Live Shows**: Check `/tour` for upcoming performances
4. **⚙️ Professional Gear**: Explore `/gear` for equipment insights

## ⚡ Getting Started

```bash
# Clone and install
git clone https://github.com/elicharlese/bangobongo.git
cd bangobongo
pnpm install

# Initialize database
pnpm run db:init

# Start development server
pnpm dev
```

Open **http://localhost:3001** and experience professional music with Web Audio API! 🎧

### 🛒 Shopify Setup (Optional)

1. Create a Shopify private app with Storefront API access
2. Copy environment template: `cp .env.shopify.example .env.local`
3. Add your credentials to `.env.local`
4. Products will automatically sync from your Shopify store

*Note: The platform includes high-quality demo products that work immediately without Shopify setup.*

### 🎨 Frontend & UI
- **Next.js 15.2.4**: React framework with App Router and TypeScript
- **TypeScript**: Type-safe development with enhanced DX
- **Tailwind CSS**: Utility-first styling with custom theming
- **Shadcn/UI**: Beautiful, accessible component library
- **React Context**: Global state management for audio and cart

### 🎧 Audio Technology
- **Web Audio API**: Native browser audio processing
- **10-Band Equalizer**: Professional frequency control (60Hz-16kHz)
- **Real-time Analysis**: Waveform visualization and spectrum analysis
- **High-Quality Pipeline**: 48kHz/24-bit audio processing

### Backend & Database
- **SQLite**: Lightweight database with Better SQLite3
- **Drizzle ORM**: Type-safe database operations
- **JWT Authentication**: Secure user authentication
- **API Routes**: RESTful API endpoints
- **File Upload**: Secure file handling

### 🛒 E-Commerce & Payments
- **Shopify Storefront API**: Real-time product synchronization via GraphQL
- **Stripe**: Payment processing with crypto support
- **Variant Management**: Size, color, and custom product options
- **Inventory Tracking**: Real-time stock levels

### Integrations
- **Shopify**: E-commerce and inventory management
- **Stripe**: Payment processing with crypto support
- **Ditto Music**: Global music distribution
- **Email**: SMTP notifications and licensing

### Development
- **ESLint**: Code linting and formatting
- **TypeScript**: Comprehensive type checking
- **Hot Reload**: Fast development iteration
- **Component Documentation**: Storybook integration ready
- **Testing Framework**: Jest and React Testing Library ready

## 📚 Documentation Structure

Our comprehensive documentation is organized in the `/docs` folder:

### 📖 Core Documentation
- **[Main Documentation](./docs/README.md)** - Complete platform overview
- **[Quick Start Guide](./docs/setup/quick-start.md)** - Get running in 5 minutes
- **[API Reference](./docs/api/README.md)** - Complete endpoint documentation

### 🎧 Audio & Music Features  
- **[Audio Processing Guide](./docs/features/audio-processing.md)** - Web Audio API implementation
- **[Music Player Complete](./docs/features/music-player-complete.md)** - Player architecture and usage

### 🛒 E-Commerce Integration
- **[Shopify Integration](./docs/setup/shopify-integration.md)** - Complete setup guide
- **[Product Management](./docs/api/README.md#products)** - Product API documentation

### 🚀 Deployment & Production
- **[Environment Setup](./docs/setup/environment.md)** - Configuration guide
- **[Deployment Guide](./docs/deployment/README.md)** - Production deployment steps
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality assurance
- **TypeScript**: Static type checking

## 🏗️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/elicharlese/bangobongo.git
cd bangobongo

# Install dependencies
npm install
# or
pnpm install

# Copy environment configuration
cp .env.example .env.local

# Initialize database
npm run init-db

# Start development server
npm run dev
```

### Configuration

1. **Environment Variables**: Update `.env.local` with your API keys
2. **Database**: Run `npm run init-db` to set up the SQLite database
3. **Shopify**: Configure your Shopify store integration
4. **Stripe**: Set up payment processing keys
5. **Email**: Configure SMTP settings for notifications

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run init-db      # Initialize database with schema
npm run db:reset     # Reset database and reinitialize
```

### Project Structure

```
bangobongo/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── music/             # Music catalog pages
│   ├── tour/              # Tour and events
│   ├── gear/              # Equipment reviews
│   └── merch/             # Merchandise store
├── components/            # Reusable UI components
├── lib/                   # Utility functions and APIs
├── contexts/              # React context providers
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🎵 Enhanced API Endpoints

### 🎧 Music & Audio Processing
- `GET /api/music/tracks` - Get tracks with Web Audio API metadata
- `GET /api/audio/analysis/{trackId}` - Real-time audio analysis data
- `POST /api/audio/equalizer` - Update equalizer settings
- `GET /api/music/[id]` - Get specific track with quality info

### 🛒 E-Commerce (Shopify Integration)
- `GET /api/products` - Unified products API (Shopify → Local fallback)
- `GET /api/shopify/products` - Direct Shopify Storefront API
- `GET /api/categories` - Product categories with filtering
- `POST /api/cart` - Advanced cart with variants support
- `POST /api/orders` - Process orders with crypto pricing

### 🎪 Tours & Events
- `GET /api/tours` - Get tour dates with venue details
- `GET /api/tours/[id]` - Specific tour with ticket integration

### 🔧 Admin Dashboard
- `GET /api/admin/dashboard` - Analytics and metrics
- `GET /api/admin/orders` - Order management with status updates
- `PUT /api/admin/products` - Product management
- `GET /api/admin/users` - User management system

*📖 Complete API documentation: [API Reference](./docs/api/README.md)*

## 🔐 Authentication

The platform includes secure user authentication with:

- **JWT Tokens**: Stateless authentication
- **Role-Based Access**: Admin, artist, and user roles
- **Password Hashing**: bcrypt security
- **Session Management**: Secure session handling

Default admin access:
- Email: `admin@bangobongo.com`
- Password: `admin123`

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Configure environment variables in Vercel dashboard
```

### Self-Hosted

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📱 Progressive Web App

BangoBongo includes PWA features:

- **Offline Support**: Service worker caching
- **Mobile Install**: Add to home screen
- **Push Notifications**: Event and release notifications
- **Responsive Design**: Mobile-first approach

## 🎨 Branding Guidelines

### Colors
- **Primary**: `#8B5CF6` (Purple)
- **Secondary**: `#06B6D4` (Cyan)  
- **Background**: `#000000` (Black)
- **Accent**: `#1F2937` (Dark Gray)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, primary color
- **Body**: Regular, foreground color

### Logo Usage
- Use official BangoBongo logo from `/public/`
- Maintain aspect ratio and clear space
- Ensure sufficient contrast on backgrounds

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software owned by BangoBongo Music. All rights reserved.

## 📞 Contact

- **Website**: [bangobongo.com](https://bangobongo.com)
- **Email**: [contact@bangobongo.com](mailto:contact@bangobongo.com)
- **Booking**: [booking@bangobongo.com](mailto:booking@bangobongo.com)
- **Social**: [@bangobongo](https://twitter.com/bangobongo)

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Vercel**: For hosting and deployment platform
- **Shopify**: For e-commerce infrastructure
- **Stripe**: For payment processing
- **Community**: For feedback and support

---

<div align="center">
  <strong>Made with ❤️ by BangoBongo Music</strong><br>
  <em>Pushing the boundaries of electronic music</em>
</div>
