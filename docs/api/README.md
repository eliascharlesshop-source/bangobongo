# 🔌 API Reference

Complete API documentation for BangoBongo's backend services, including music management, e-commerce integration, and Web Audio API features.

## 📋 Base Information

- **Base URL**: `http://localhost:3001/api` (development)
- **Production URL**: `https://your-domain.com/api`
- **API Version**: v1
- **Response Format**: JSON
- **Authentication**: Bearer token (for admin endpoints)

## 🎵 Music API

### Tracks Management

#### Get Tracks
```http
GET /api/music/tracks
```

**Parameters**:
- `genre` (string, optional) - Filter by genre
- `artist` (string, optional) - Filter by artist
- `album` (string, optional) - Filter by album
- `limit` (number, optional) - Number of tracks to return (default: 20)
- `offset` (number, optional) - Number of tracks to skip

**Example Request**:
```bash
curl "http://localhost:3001/api/music/tracks?genre=Electronic&limit=10"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "tracks": [
      {
        "id": "neon-pulse",
        "title": "Neon Pulse",
        "artist": "BangoBongo",
        "duration": 215,
        "albumArt": "/abstract-electronic-album-art.png",
        "audioUrl": "/audio/neon-pulse.mp3",
        "genre": "Electronic",
        "bpm": 128,
        "key": "Am",
        "year": 2024,
        "waveformData": [...],
        "qualitySettings": {
          "bitrate": "320kbps",
          "sampleRate": "44.1kHz",
          "channels": "stereo"
        }
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 10,
      "offset": 0
    }
  }
}
```

#### Add Track (Admin Only)
```http
POST /api/music/tracks
Authorization: Bearer {admin_token}
```

**Request Body**:
```json
{
  "title": "New Track",
  "artist": "BangoBongo",
  "duration": 180,
  "albumArt": "/album-art.jpg",
  "audioUrl": "/audio/new-track.mp3",
  "genre": "Synthwave",
  "bpm": 120,
  "key": "Dm",
  "year": 2024
}
```

### Audio Processing

#### Get Audio Analysis
```http
GET /api/audio/analysis/{trackId}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "trackId": "neon-pulse",
    "waveform": [...],
    "frequencyData": [...],
    "tempo": 128,
    "key": "Am",
    "loudness": -6.2,
    "duration": 215.5
  }
}
```

#### Update Equalizer Settings
```http
POST /api/audio/equalizer
```

**Request Body**:
```json
{
  "settings": {
    "32": 0,
    "64": 2,
    "125": 1,
    "250": -1,
    "500": 0,
    "1000": 1,
    "2000": 3,
    "4000": 2,
    "8000": 1,
    "16000": 0
  }
}
```

## 🛒 E-commerce API

### Products

#### Get Products (Unified API)
```http
GET /api/products
```

**Parameters**:
- `category` (string, optional) - Filter by product category
- `featured` (boolean, optional) - Show only featured products
- `limited` (boolean, optional) - Show only limited edition items
- `search` (string, optional) - Search products by name/description
- `limit` (number, optional) - Number of products (default: 20)
- `page` (number, optional) - Page number for pagination
- `local` (boolean, optional) - Force use of local products only

**Example Request**:
```bash
curl "http://localhost:3001/api/products?category=Merchandise&featured=true"
```

**Example Response**:
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
        "description": "Premium quality hoodie featuring the iconic BangoBongo Electronic Dreams artwork.",
        "category": "Merchandise",
        "imageUrl": "/merch/bangobongo-hoodie.jpg",
        "images": [
          "/merch/bangobongo-hoodie.jpg",
          "/merch/bangobongo-hoodie-back.jpg"
        ],
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Black", "Navy", "Charcoal"],
        "tags": ["hoodie", "merchandise", "electronic"],
        "inStock": true,
        "isFeatured": true,
        "isLimited": false,
        "discountPercentage": 0,
        "inventory": 25,
        "variants": [...]
      }
    ],
    "source": "shopify",
    "total": 1
  }
}
```

#### Get Shopify Products (Direct)
```http
GET /api/shopify/products
```

**Parameters**: Same as unified products API

**Features**:
- Direct Shopify Storefront API integration
- Real-time product synchronization
- Automatic fallback to demo products
- GraphQL-based product fetching

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer {admin_token}
```

**Request Body**:
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 29.99,
  "cryptoPrice": 0.00039,
  "categoryId": "merchandise",
  "imageUrl": "/products/new-product.jpg",
  "images": ["/products/new-product.jpg"],
  "sizes": ["S", "M", "L"],
  "colors": ["Black", "White"],
  "tags": ["new", "merchandise"],
  "isFeatured": false,
  "isLimited": false,
  "discountPercentage": 0
}
```

### Categories

#### Get Categories
```http
GET /api/categories
```

**Response**:
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "merchandise",
        "name": "Merchandise",
        "slug": "merchandise",
        "description": "T-shirts, hoodies, and accessories",
        "productCount": 15
      },
      {
        "id": "vinyl",
        "name": "Vinyl Records",
        "slug": "vinyl",
        "description": "Limited edition vinyl releases",
        "productCount": 8
      }
    ]
  }
}
```

### Cart Management

#### Add to Cart
```http
POST /api/cart
```

**Request Body**:
```json
{
  "productId": "bangobongo-hoodie-001",
  "variantId": "hoodie-black-xl",
  "quantity": 1
}
```

#### Get Cart
```http
GET /api/cart
```

#### Update Cart Item
```http
PUT /api/cart/{itemId}
```

#### Remove from Cart
```http
DELETE /api/cart/{itemId}
```

## 🔐 Authentication API

### User Authentication

#### Login
```http
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### Register
```http
POST /api/auth/register
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### Refresh Token
```http
POST /api/auth/refresh
```

### Admin Authentication

#### Admin Login
```http
POST /api/admin/login
```

**Request Body**:
```json
{
  "email": "admin@bangobongo.com",
  "password": "admin_password",
  "adminKey": "admin_secret_key"
}
```

## 🎛️ Admin API

### Dashboard Analytics

#### Get Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer {admin_token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalProducts": 25,
      "totalOrders": 142,
      "totalRevenue": 8450.00,
      "totalUsers": 89,
      "recentOrders": 12,
      "topProducts": [...]
    },
    "analytics": {
      "salesChart": [...],
      "productViews": [...],
      "userGrowth": [...]
    }
  }
}
```

### Order Management

#### Get Orders
```http
GET /api/admin/orders
Authorization: Bearer {admin_token}
```

**Parameters**:
- `status` (string, optional) - Filter by order status
- `limit` (number, optional) - Number of orders
- `page` (number, optional) - Page number

#### Update Order Status
```http
PUT /api/admin/orders/{orderId}
Authorization: Bearer {admin_token}
```

**Request Body**:
```json
{
  "status": "shipped",
  "trackingNumber": "1Z999AA1234567890",
  "notes": "Order shipped via UPS"
}
```

### User Management

#### Get Users
```http
GET /api/admin/users
Authorization: Bearer {admin_token}
```

#### Update User
```http
PUT /api/admin/users/{userId}
Authorization: Bearer {admin_token}
```

## 💳 Payment API

### Process Payment
```http
POST /api/payments/process
```

**Request Body**:
```json
{
  "cartId": "cart-123",
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvv": "123"
  },
  "billingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  }
}
```

### Crypto Payment
```http
POST /api/payments/crypto
```

**Request Body**:
```json
{
  "cartId": "cart-123",
  "cryptocurrency": "bitcoin",
  "walletAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}
```

## 🎤 Tours API

### Get Tours
```http
GET /api/tours
```

**Response**:
```json
{
  "success": true,
  "data": {
    "tours": [
      {
        "id": "neon-nights-2024",
        "name": "Neon Nights Tour 2024",
        "description": "Electronic music tour across major cities",
        "startDate": "2024-08-15",
        "endDate": "2024-10-30",
        "venues": [
          {
            "id": "venue-1",
            "name": "Electronic Arena",
            "city": "Los Angeles",
            "state": "CA",
            "date": "2024-08-15",
            "time": "20:00",
            "ticketUrl": "https://tickets.example.com/venue-1"
          }
        ],
        "status": "upcoming"
      }
    ]
  }
}
```

### Add Tour Date (Admin Only)
```http
POST /api/tours/{tourId}/venues
Authorization: Bearer {admin_token}
```

## 📊 Analytics API

### Track Event
```http
POST /api/analytics/track
```

**Request Body**:
```json
{
  "event": "track_played",
  "properties": {
    "trackId": "neon-pulse",
    "userId": "user-123",
    "source": "music_page",
    "duration": 215,
    "timestamp": "2024-07-28T10:30:00Z"
  }
}
```

### Get Analytics (Admin Only)
```http
GET /api/analytics/reports
Authorization: Bearer {admin_token}
```

**Parameters**:
- `metric` (string) - Metric to retrieve (plays, sales, users)
- `period` (string) - Time period (day, week, month, year)
- `startDate` (string) - Start date (ISO format)
- `endDate` (string) - End date (ISO format)

## 🚨 Error Handling

### Error Response Format

All API endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product could not be found",
    "details": {
      "productId": "invalid-product-id"
    }
  },
  "timestamp": "2024-07-28T10:30:00Z"
}
```

### HTTP Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden (Admin access required)
- **404** - Not Found
- **422** - Validation Error
- **429** - Rate Limited
- **500** - Internal Server Error

### Common Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `AUTHENTICATION_REQUIRED` - Valid authentication token required
- `ADMIN_ACCESS_REQUIRED` - Admin privileges required
- `PRODUCT_NOT_FOUND` - Product does not exist
- `TRACK_NOT_FOUND` - Audio track does not exist
- `ORDER_NOT_FOUND` - Order does not exist
- `SHOPIFY_ERROR` - Shopify API error
- `PAYMENT_FAILED` - Payment processing error
- `RATE_LIMITED` - Too many requests

## 🔄 Rate Limiting

### Limits by Endpoint Type

- **Public API**: 100 requests per minute per IP
- **Authenticated API**: 1000 requests per minute per user
- **Admin API**: 2000 requests per minute per admin
- **Shopify API**: Follows Shopify's rate limits

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📝 API Versioning

### Current Version: v1

All endpoints are currently on version 1. Future versions will be supported via:

- **URL Path**: `/api/v2/products`
- **Header**: `API-Version: v2`
- **Query Parameter**: `/api/products?version=v2`

### Deprecation Policy

- **Notice Period**: 6 months minimum
- **Support Period**: 12 months for breaking changes
- **Migration Guide**: Provided for all major version changes

## 🧪 Testing & Development

### Postman Collection

Import our Postman collection for easy API testing:

```bash
# Download collection
curl -o bangobongo-api.json https://raw.githubusercontent.com/elicharlese/bangobongo/main/docs/api/postman-collection.json

# Import into Postman
# File → Import → Upload Files → Select bangobongo-api.json
```

### API Testing Examples

```bash
# Test music API
curl "http://localhost:3001/api/music/tracks"

# Test products with Shopify fallback
curl "http://localhost:3001/api/products?featured=true"

# Test admin authentication (requires admin credentials)
curl -X POST "http://localhost:3001/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123","adminKey":"test-key"}'

# Test with authentication token
curl -H "Authorization: Bearer your-token-here" \
  "http://localhost:3001/api/admin/dashboard"
```

### Mock Data

Development environment includes comprehensive mock data:

- **5 Sample Tracks** - High-quality electronic music
- **6 Demo Products** - Professional merchandise examples
- **Sample Orders** - Test order data
- **Demo Users** - Test user accounts
- **Analytics Data** - Sample metrics and reports

## 📚 SDK & Libraries

### JavaScript/TypeScript SDK

```typescript
import { BangoBongoAPI } from '@bangobongo/api-client'

const api = new BangoBongoAPI({
  baseURL: 'http://localhost:3001/api',
  apiKey: 'your-api-key'
})

// Get tracks
const tracks = await api.music.getTracks({ genre: 'Electronic' })

// Get products
const products = await api.products.getProducts({ featured: true })

// Admin operations (requires admin token)
const orders = await api.admin.getOrders()
```

### React Hooks

```tsx
import { useProducts, useTrack, useAuth } from '@bangobongo/react-hooks'

export function ProductPage() {
  const { products, loading, error } = useProducts({ featured: true })
  const { user, login, logout } = useAuth()
  
  if (loading) return <Loading />
  if (error) return <Error message={error.message} />
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

---

## 📞 Support

- **API Documentation**: This page
- **GitHub Issues**: [Report API bugs](https://github.com/elicharlese/bangobongo/issues)
- **Discord Community**: Join our developer community
- **Email Support**: api-support@bangobongo.com

**Need help?** Check our [troubleshooting guide](../user-guides/FAQ.md) or reach out to our support team!
