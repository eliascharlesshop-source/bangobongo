# 🎵 BangoBongo Documentation

Welcome to the comprehensive documentation for the BangoBongo music platform and e-commerce system.

## 📖 Table of Contents

### 🚀 Getting Started
- [Project Overview](#project-overview)
- [Quick Start Guide](./setup/quick-start.md)
- [Development Setup](./setup/development.md)
- [Shopify Integration Setup](./setup/shopify-integration.md)

### 🎵 Features
- [Music Player System](./features/music-player.md)
- [E-commerce Integration](./features/ecommerce.md)
- [Audio Processing](./features/audio-processing.md)
- [User Interface](./features/ui-components.md)

### 🔌 API Documentation
- [Products API](./api/products.md)
- [Shopify Integration](./api/shopify.md)
- [Music API](./api/music.md)
- [Authentication](./api/authentication.md)

### 🛠️ Development
- [Architecture Overview](./architecture.md)
- [Component Library](./components.md)
- [Database Schema](./database.md)
- [Deployment Guide](./deployment.md)

### 📋 Project Status
- [Enhancement Summary](./enhancement-summary.md)
- [Backend Implementation](./backend-complete.md)
- [Feature Roadmap](./roadmap.md)

## 🎯 Project Overview

BangoBongo is a modern music platform built with Next.js 15, featuring:

### 🎧 Professional Music Player
- **Web Audio API Integration**: High-quality audio processing with gain nodes and equalizer
- **10-Band Graphic Equalizer**: Professional frequency control (32Hz - 16kHz)
- **Real-time Audio Analysis**: Buffer monitoring, loading states, and quality indicators
- **Multiple Player Modes**: Floating, thin, and full player interfaces
- **Advanced Controls**: Volume, repeat, shuffle, queue management

### 🛒 E-commerce System
- **Shopify Integration**: Live product fetching via Storefront API
- **Fallback Products**: High-quality demo products for seamless experience
- **Product Variants**: Support for sizes, colors, and options
- **Crypto Pricing**: Bitcoin equivalent pricing display
- **Advanced Filtering**: Category, featured, search functionality

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Themes**: Complete theme system with smooth transitions
- **Loading States**: Professional loading indicators and animations
- **Progressive Enhancement**: Graceful degradation for all features

## 🏗️ Technical Stack

### Frontend
- **Next.js 15.2.4**: React framework with App Router
- **TypeScript**: Full type safety and IntelliSense
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern component library
- **Web Audio API**: Professional audio processing

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **SQLite**: Local database with better-sqlite3
- **Shopify Storefront API**: E-commerce integration
- **Zod**: Runtime type validation

### Audio Technology
- **Web Audio API**: Professional audio processing chain
- **Biquad Filters**: 10-band graphic equalizer
- **Gain Nodes**: High-quality volume control
- **Analyser Nodes**: Real-time frequency analysis

## 🚀 Quick Start

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd bangobongo
   pnpm install
   ```

2. **Setup Environment** (Optional):
   ```bash
   cp docs/setup/shopify-setup.env .env.local
   # Add your Shopify credentials
   ```

3. **Add Audio Files**:
   - Place MP3 files (320kbps, 44.1kHz) in `/public/audio/`
   - Follow naming convention: `{track-id}.mp3`

4. **Start Development**:
   ```bash
   pnpm dev
   ```

5. **Visit Application**:
   - Main App: http://localhost:3001
   - Music Player: http://localhost:3001/music
   - Merchandise: http://localhost:3001/merch
   - API Test: http://localhost:3001/api/products

## 📱 Key Features

### Music Player Excellence
- ✅ **Professional Audio Processing** - Web Audio API with gain nodes and 10-band EQ
- ✅ **High-Quality Audio Support** - 320kbps MP3 optimization
- ✅ **Real-time Visual Feedback** - Loading states, buffer progress, quality indicators
- ✅ **Advanced Controls** - Equalizer, volume gain control, smooth animations
- ✅ **Multiple Player Modes** - Floating, thin, and full player interfaces

### E-commerce Integration
- ✅ **Live Shopify Integration** - Real product fetching via Storefront API
- ✅ **Intelligent Fallback** - High-quality demo products for seamless experience
- ✅ **Advanced Product Features** - Variants, filtering, search, crypto pricing
- ✅ **Professional Product Data** - Comprehensive information with images and metadata

### Developer Experience
- ✅ **Full TypeScript Support** - Complete type safety and IntelliSense
- ✅ **Comprehensive Documentation** - Detailed guides and setup instructions
- ✅ **Easy Configuration** - Simple setup with environment variables
- ✅ **Extensible Architecture** - Clean separation of concerns and modular design

## 🤝 Contributing

Please read our [contribution guidelines](./CONTRIBUTING.md) before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 📞 Support

For support and questions:
- Check the [documentation](./README.md)
- Review [common issues](./troubleshooting.md)
- Open an issue on GitHub

---

Built with ❤️ for the music community by the BangoBongo team.
