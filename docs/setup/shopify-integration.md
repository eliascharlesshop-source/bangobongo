# 🛍️ Shopify Integration Guide

Complete guide to setting up Shopify e-commerce integration with BangoBongo.

## 🎯 Overview

BangoBongo integrates with Shopify using the Storefront API to fetch products, variants, and collections. The integration includes:

- **Live Product Fetching**: Real-time product data from your Shopify store
- **Intelligent Fallback**: High-quality demo products when Shopify is unavailable
- **Advanced Filtering**: Search, categories, featured products, and variants
- **Crypto Pricing**: Automatic Bitcoin equivalent pricing
- **Product Variants**: Full support for sizes, colors, and options

## 🚀 Quick Setup

### 1. Create Shopify Private App

1. **Access Shopify Admin**:
   - Go to your Shopify store admin panel
   - Navigate to: **Settings** → **Apps and sales channels** → **Develop apps**

2. **Create New App**:
   - Click **"Create an app"**
   - Name: `BangoBongo Integration`
   - Developer: Your name/company

3. **Configure Storefront API**:
   - Click **"Configure Storefront API scopes"**
   - Enable these permissions:
     - ✅ `unauthenticated_read_products`
     - ✅ `unauthenticated_read_product_listings`
     - ✅ `unauthenticated_read_collections`
     - ✅ `unauthenticated_read_product_tags`

4. **Generate Access Token**:
   - Click **"Install app"**
   - Copy the **Storefront access token**

### 2. Configure Environment

Create or update `.env.local`:
```env
# Your Shopify store domain (without .myshopify.com)
SHOPIFY_DOMAIN=your-shop-name

# Storefront API access token
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_1234567890abcdef1234567890abcdef

# Optional: Admin API (for advanced features)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_admin_token_here
```

**Example**:
```env
SHOPIFY_DOMAIN=bangobongo-music
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 3. Verify Integration

Test your setup:
```bash
# Test Shopify API directly
curl http://localhost:3001/api/shopify/products

# Test unified products API (tries Shopify first)
curl http://localhost:3001/api/products
```

## 🏪 Product Setup in Shopify

### Product Requirements

For optimal integration, structure your Shopify products as follows:

**Product Types** (use these categories):
- `Merchandise` - T-shirts, hoodies, accessories
- `Vinyl` - Vinyl records and albums
- `Gear` - Studio equipment, headphones
- `Poster` - Concert posters, artwork
- `Accessories` - Stickers, pins, small items

**Product Tags** (add these tags):
- `featured` - For featured products
- `limited-edition` - For limited releases
- `sale` - For discounted items
- Genre tags: `electronic`, `synthwave`, `ambient`
- Category tags: `merch`, `music`, `gear`

### Example Product Setup

**Product 1: BangoBongo Hoodie**
```
Title: BangoBongo Electronic Dreams Hoodie
Product Type: Merchandise
Tags: featured, merchandise, electronic, hoodie
Price: $65.00
Variants:
  - Size: S, M, L, XL, XXL
  - Color: Black, Navy, Charcoal
```

**Product 2: Digital Dreams Vinyl**
```
Title: Digital Dreams - Limited Edition Vinyl
Product Type: Vinyl
Tags: featured, limited-edition, vinyl, digital-dreams
Price: $35.00
Variants:
  - Format: Black Vinyl, Limited Purple Vinyl
```

### Product Images

**Image Requirements**:
- **Format**: JPEG or PNG
- **Resolution**: Minimum 800x800px (1200x1200px recommended)
- **Aspect Ratio**: Square (1:1) preferred
- **File Size**: Under 2MB for optimal loading

**Image Guidelines**:
- Use high-quality product photography
- Consistent lighting and backgrounds
- Multiple angles (front, back, detail shots)
- Lifestyle images for context

## 🔧 Advanced Configuration

### Custom Product Transformation

Customize how Shopify products are transformed in `/app/api/shopify/products/route.ts`:

```typescript
function transformShopifyProduct(shopifyProduct: any) {
  const product = shopifyProduct.node
  
  return {
    id: product.handle,
    name: product.title,
    price: parseFloat(product.priceRange.minVariantPrice.amount),
    // Custom crypto price calculation
    cryptoPrice: parseFloat(product.priceRange.minVariantPrice.amount) * 0.000013,
    description: product.description,
    category: product.productType || 'Merchandise',
    // Custom image processing
    imageUrl: product.images.edges[0]?.node.url || '/placeholder.jpg',
    images: product.images.edges.map((edge: any) => edge.node.url),
    // Extract variants
    sizes: extractVariantOptions(product.variants, 'Size'),
    colors: extractVariantOptions(product.variants, 'Color'),
    // Process tags
    tags: product.tags,
    inStock: product.availableForSale,
    // Custom featured logic
    isFeatured: product.tags.includes('featured'),
    isLimited: product.tags.includes('limited-edition'),
    // Custom discount calculation
    discountPercentage: calculateDiscount(product),
    inventory: product.totalInventory || 0,
    // Keep Shopify references
    shopifyId: product.id,
    variants: product.variants.edges.map(transformVariant)
  }
}
```

### GraphQL Query Customization

Modify the Shopify GraphQL query for additional fields:

```graphql
query getProducts($first: Int!, $query: String) {
  products(first: $first, query: $query) {
    edges {
      node {
        id
        title
        description
        handle
        createdAt
        updatedAt
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
              }
            }
          }
        }
        tags
        productType
        vendor
        availableForSale
        totalInventory
        seo {
          title
          description
        }
        metafields(first: 10) {
          edges {
            node {
              key
              value
              type
            }
          }
        }
      }
    }
  }
}
```

## 📊 API Endpoints

### Shopify Products API

**Endpoint**: `GET /api/shopify/products`

**Parameters**:
- `category` - Filter by product type
- `featured=true` - Show only featured products
- `limited=true` - Show only limited edition
- `search` - Full-text search
- `limit` - Number of products (default: 20)

**Example Requests**:
```bash
# Get all products
GET /api/shopify/products

# Get featured merchandise
GET /api/shopify/products?category=Merchandise&featured=true

# Search for hoodies
GET /api/shopify/products?search=hoodie

# Get limited edition items
GET /api/shopify/products?limited=true&limit=5
```

### Unified Products API

**Endpoint**: `GET /api/products`

This endpoint automatically tries Shopify first, then falls back to local products:

```bash
# Automatic routing (Shopify → Local)
GET /api/products

# Force local products only
GET /api/products?local=true

# All Shopify parameters work
GET /api/products?category=Vinyl&featured=true
```

## 🎨 Frontend Integration

### Using Products in Components

```tsx
import { useState, useEffect } from 'react'

export function ProductGrid() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(res => res.json())
      .then(data => {
        setProducts(data.data.products)
        setLoading(false)
      })
  }, [])

  if (loading) return <ProductSkeleton />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Product Card Component

```tsx
interface Product {
  id: string
  name: string
  price: number
  cryptoPrice: number
  imageUrl: string
  category: string
  isFeatured: boolean
  isLimited: boolean
  inStock: boolean
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.isLimited && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
            Limited Edition
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold">${product.price}</span>
            <span className="text-sm text-muted-foreground block">
              ₿ {product.cryptoPrice.toFixed(6)}
            </span>
          </div>
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

## 🚨 Error Handling

### Graceful Fallbacks

The integration includes multiple fallback levels:

1. **Shopify Available**: Uses live product data
2. **Shopify Error**: Falls back to high-quality demo products
3. **Network Error**: Shows cached products or error state

### Error Monitoring

Add error tracking:

```typescript
// In your product fetch function
try {
  const response = await fetch('/api/products')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return data.data.products
} catch (error) {
  console.error('Product fetch failed:', error)
  // Log to error tracking service
  trackError('shopify_integration_error', error)
  // Return fallback products
  return fallbackProducts
}
```

## 🔒 Security Best Practices

### API Token Security

- ✅ **Use Storefront API**: Public API designed for frontend use
- ✅ **Environment Variables**: Never commit tokens to version control
- ✅ **Rotate Tokens**: Regularly update access tokens
- ✅ **Scope Limitation**: Only enable required permissions

### Rate Limiting

Shopify Storefront API limits:
- **Authenticated**: 10,000 requests per hour
- **Unauthenticated**: 1,000 requests per hour per IP

Implement caching:
```typescript
// Simple in-memory cache
const productCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getCachedProducts(query: string) {
  const cacheKey = `products:${query}`
  const cached = productCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  const products = await fetchFromShopify(query)
  productCache.set(cacheKey, {
    data: products,
    timestamp: Date.now()
  })
  
  return products
}
```

## 📈 Performance Optimization

### Image Optimization

```tsx
import Image from 'next/image'

export function OptimizedProductImage({ product }) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={400}
      height={400}
      className="object-cover"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### Pagination

Implement pagination for large catalogs:
```typescript
export async function getProducts(page = 1, limit = 20) {
  const variables = {
    first: limit,
    after: page > 1 ? btoa(`arrayconnection:${(page - 1) * limit}`) : null
  }
  
  return fetchFromShopify(PRODUCTS_QUERY, variables)
}
```

## 🧪 Testing

### Test Shopify Integration

```bash
# Test basic product fetch
curl "http://localhost:3001/api/shopify/products" | jq

# Test with filters
curl "http://localhost:3001/api/shopify/products?featured=true&limit=5" | jq

# Test search
curl "http://localhost:3001/api/shopify/products?search=hoodie" | jq

# Test error handling (invalid domain)
SHOPIFY_DOMAIN=invalid-domain curl "http://localhost:3001/api/shopify/products"
```

### Unit Tests

```typescript
import { transformShopifyProduct } from '../api/shopify/products/route'

describe('Shopify Integration', () => {
  test('transforms Shopify product correctly', () => {
    const shopifyProduct = {
      node: {
        id: 'gid://shopify/Product/123',
        title: 'Test Product',
        handle: 'test-product',
        priceRange: {
          minVariantPrice: { amount: '25.00', currencyCode: 'USD' }
        },
        images: { edges: [{ node: { url: 'https://example.com/image.jpg' } }] },
        tags: ['featured', 'merchandise'],
        productType: 'Merchandise',
        availableForSale: true,
        totalInventory: 10
      }
    }

    const result = transformShopifyProduct(shopifyProduct)
    
    expect(result.id).toBe('test-product')
    expect(result.name).toBe('Test Product')
    expect(result.price).toBe(25.00)
    expect(result.isFeatured).toBe(true)
    expect(result.category).toBe('Merchandise')
  })
})
```

## 🔄 Migration from Local Products

### Step-by-Step Migration

1. **Setup Shopify** (keep local products as fallback)
2. **Test Integration** with a few products
3. **Migrate Product Data** from local to Shopify
4. **Update Frontend** to use new API endpoints
5. **Monitor Performance** and error rates

### Data Migration Script

```typescript
// scripts/migrate-to-shopify.ts
import { getLocalProducts } from '../lib/db'
import { createShopifyProduct } from '../lib/shopify-admin'

export async function migrateProducts() {
  const localProducts = await getLocalProducts()
  
  for (const product of localProducts) {
    try {
      await createShopifyProduct({
        title: product.name,
        body_html: product.description,
        product_type: product.category,
        tags: product.tags.join(','),
        variants: [{
          price: product.price,
          inventory_quantity: product.inventory
        }]
      })
      console.log(`Migrated: ${product.name}`)
    } catch (error) {
      console.error(`Failed to migrate ${product.name}:`, error)
    }
  }
}
```

## 📞 Support & Troubleshooting

### Common Issues

**1. Products Not Loading**
- Check environment variables
- Verify Shopify token permissions
- Test API endpoint directly

**2. Image Issues**
- Verify image URLs are accessible
- Check CORS settings
- Use Next.js Image optimization

**3. Variant Problems**
- Ensure variants have proper options
- Check variant availability
- Verify option names (Size, Color, etc.)

### Debug Mode

Enable debug logging:
```env
DEBUG_SHOPIFY=true
NODE_ENV=development
```

### Getting Help

- 📖 Check [Shopify API Documentation](https://shopify.dev/api/storefront)
- 🐛 Open GitHub issue with error details
- 💬 Join our Discord for community support
- 📧 Contact support team

---

🎉 **Success!** You now have a fully integrated Shopify e-commerce system with intelligent fallbacks and professional product management.
