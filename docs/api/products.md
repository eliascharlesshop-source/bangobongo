# 🔌 Products API Documentation

Complete API reference for the BangoBongo products system with Shopify integration.

## 📋 Overview

The Products API provides a unified interface for accessing both Shopify products and local fallback products. It automatically handles routing, error recovery, and data transformation.

## 🎯 Base URLs

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

## 🛍️ Products Endpoints

### Get Products (Unified)

Automatically tries Shopify first, falls back to local products on error.

```http
GET /api/products
```

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | string | Filter by product type | `Merchandise` |
| `featured` | boolean | Show only featured products | `true` |
| `limited` | boolean | Show only limited edition | `true` |
| `search` | string | Full-text search | `hoodie` |
| `page` | number | Page number (local only) | `1` |
| `limit` | number | Products per page | `20` |
| `local` | boolean | Force local products only | `true` |

**Example Requests:**
```bash
# Get all products
GET /api/products

# Get featured merchandise
GET /api/products?category=Merchandise&featured=true

# Search for vinyl records
GET /api/products?search=vinyl&limit=10

# Force local products
GET /api/products?local=true
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product-id",
        "name": "Product Name",
        "price": 25.00,
        "cryptoPrice": 0.00033,
        "description": "Product description...",
        "category": "Merchandise",
        "imageUrl": "/product-image.jpg",
        "images": ["/image1.jpg", "/image2.jpg"],
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Black", "White", "Navy"],
        "tags": ["featured", "merchandise"],
        "inStock": true,
        "isFeatured": true,
        "isLimited": false,
        "discountPercentage": 0,
        "inventory": 25,
        "variants": [...] // Shopify only
      }
    ],
    "source": "shopify", // or "local"
    "total": 6,
    "pagination": { // Local products only
      "page": 1,
      "limit": 20,
      "total": 6,
      "pages": 1
    }
  }
}
```

### Get Shopify Products (Direct)

Direct access to Shopify products without fallback.

```http
GET /api/shopify/products
```

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `category` | string | Product type filter | - |
| `featured` | boolean | Featured products only | `false` |
| `limited` | boolean | Limited edition only | `false` |
| `search` | string | Search query | - |
| `limit` | number | Max products to return | `20` |

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "source": "shopify",
    "total": 15
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch products",
  "message": "Shopify API error: 401"
}
```

### Create Product (Local)

Add a new product to the local database.

```http
POST /api/products
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 25.00,
  "cryptoPrice": 0.00033,
  "categoryId": "category-uuid",
  "imageUrl": "/product-image.jpg",
  "images": ["/image1.jpg", "/image2.jpg"],
  "sizes": ["S", "M", "L"],
  "colors": ["Black", "White"],
  "tags": ["new", "merchandise"],
  "inStock": true,
  "isFeatured": false,
  "isLimited": false,
  "discountPercentage": 0,
  "relatedAlbum": "Album Name",
  "relatedTour": "Tour Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "name": "New Product",
    // ... full product object
  },
  "message": "Product created successfully"
}
```

## 🎵 Music API

### Get Tracks

```http
GET /api/music/tracks
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tracks": [
      {
        "id": "track-id",
        "title": "Track Title",
        "artist": "BangoBongo",
        "duration": 215,
        "albumArt": "/album-art.jpg",
        "audioUrl": "/audio/track.mp3",
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
    ]
  }
}
```

### Get Track by ID

```http
GET /api/music/tracks/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "track": {
      "id": "track-id",
      "title": "Track Title",
      // ... full track object
    }
  }
}
```

## 🏷️ Categories API

### Get Categories

```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "category-uuid",
        "name": "Merchandise",
        "slug": "merchandise",
        "description": "Clothing and accessories",
        "productCount": 15
      }
    ]
  }
}
```

### Create Category

```http
POST /api/categories
```

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description"
}
```

## 🔐 Authentication API

### Admin Login

```http
POST /api/auth/admin/login
```

**Request Body:**
```json
{
  "email": "admin@bangobongo.com",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "email": "admin@bangobongo.com",
      "role": "admin"
    }
  }
}
```

## 📊 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {
    "field": "Specific field error"
  }
}
```

### Error Codes

| Code | Description | Common Causes |
|------|-------------|---------------|
| 400 | Bad Request | Invalid parameters, missing fields |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Data validation failed |
| 500 | Server Error | Database error, external API failure |

### Shopify-Specific Errors

| Error | Description | Solution |
|-------|-------------|----------|
| `SHOPIFY_CONFIG_MISSING` | Environment variables not set | Configure SHOPIFY_DOMAIN and token |
| `SHOPIFY_API_ERROR` | Shopify API returned error | Check token permissions, rate limits |
| `SHOPIFY_TIMEOUT` | Request timeout | Retry request, check network |
| `SHOPIFY_RATE_LIMIT` | Rate limit exceeded | Implement backoff, reduce requests |

## 🔄 Data Transformation

### Shopify to Unified Format

```typescript
// Shopify GraphQL response
{
  "node": {
    "id": "gid://shopify/Product/123",
    "title": "Product Name",
    "priceRange": {
      "minVariantPrice": {
        "amount": "25.00",
        "currencyCode": "USD"
      }
    },
    "variants": {
      "edges": [...]
    }
  }
}

// Transformed to unified format
{
  "id": "product-handle",
  "name": "Product Name",
  "price": 25.00,
  "cryptoPrice": 0.00033,
  "shopifyId": "gid://shopify/Product/123",
  "variants": [...]
}
```

### Crypto Price Calculation

```typescript
// Current calculation (example)
const BTC_USD_RATE = 76000 // Updated dynamically
const cryptoPrice = usdPrice / BTC_USD_RATE

// Example: $25.00 / $76,000 = 0.00032895 BTC
```

## 📈 Performance & Caching

### Response Times

| Endpoint | Target | Typical |
|----------|--------|---------|
| `/api/products` | < 500ms | 200-400ms |
| `/api/shopify/products` | < 1000ms | 500-800ms |
| `/api/products?local=true` | < 100ms | 50-100ms |

### Caching Strategy

```typescript
// Cache headers for product responses
{
  "Cache-Control": "public, max-age=300", // 5 minutes
  "ETag": "product-list-hash",
  "Last-Modified": "Wed, 21 Oct 2023 07:28:00 GMT"
}
```

### Rate Limiting

| API | Limit | Window |
|-----|-------|--------|
| Shopify Storefront | 1000 req/hour | Per IP |
| Local Products | 1000 req/min | Per IP |
| Admin Endpoints | 100 req/min | Per user |

## 🧪 Testing & Examples

### cURL Examples

```bash
# Get all products
curl -X GET "http://localhost:3001/api/products" \
  -H "Accept: application/json"

# Get featured vinyl records
curl -X GET "http://localhost:3001/api/products?category=Vinyl&featured=true" \
  -H "Accept: application/json"

# Create a new product (admin required)
curl -X POST "http://localhost:3001/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-admin-token" \
  -d '{
    "name": "New Hoodie",
    "price": 65.00,
    "categoryId": "merchandise-category-id"
  }'

# Test Shopify integration
curl -X GET "http://localhost:3001/api/shopify/products?limit=5" \
  -H "Accept: application/json"
```

### JavaScript Examples

```javascript
// Fetch products with error handling
async function getProducts(filters = {}) {
  try {
    const params = new URLSearchParams(filters)
    const response = await fetch(`/api/products?${params}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.data.products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw error
  }
}

// Usage examples
const allProducts = await getProducts()
const featuredMerch = await getProducts({ 
  category: 'Merchandise', 
  featured: true 
})
const searchResults = await getProducts({ 
  search: 'vinyl', 
  limit: 10 
})
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
  // ... other fields
}

export function useProducts(filters = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams(filters)
        const response = await fetch(`/api/products?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        setProducts(data.data.products)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [JSON.stringify(filters)])

  return { products, loading, error }
}

// Usage in component
function ProductList() {
  const { products, loading, error } = useProducts({ 
    featured: true, 
    limit: 6 
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

## 🔒 Security

### API Key Authentication

```typescript
// Admin endpoints require Bearer token
headers: {
  'Authorization': 'Bearer your-jwt-token',
  'Content-Type': 'application/json'
}
```

### Input Validation

All inputs are validated using Zod schemas:

```typescript
const productSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  category: z.string().min(1),
  // ... other validations
})
```

### CORS Configuration

```javascript
// API responses include CORS headers
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
```

---

📚 **Need more help?** Check out our [Shopify Integration Guide](../setup/shopify-integration.md) or [Quick Start Guide](../setup/quick-start.md).
