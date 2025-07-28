# Environment Variables

## Core Application
- `DATABASE_URL`: Path to the SQLite database
- `NEXTAUTH_SECRET`: Secret for authentication
- `NEXTAUTH_URL`: Base URL for NextAuth

## Ditto Music API Integration
- `DITTO_API_KEY`: Your Ditto Music API key
- `DITTO_API_SECRET`: Your Ditto Music API secret  
- `DITTO_ARTIST_ID`: Your Ditto artist/label ID
- `DITTO_BASE_URL`: Ditto API base URL (default: https://api.dittomusic.com/v1)

## Shopify Integration
- `SHOPIFY_DOMAIN`: Your Shopify store domain (your-store.myshopify.com)
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Shopify Storefront API access token
- `SHOPIFY_ADMIN_ACCESS_TOKEN`: Shopify Admin API access token (for product sync)
- `SHOPIFY_WEBHOOK_SECRET`: Shopify webhook secret for order notifications

## Payment Processing
- `STRIPE_PUBLIC_KEY`: Stripe publishable key for payments
- `STRIPE_SECRET_KEY`: Stripe secret key for server-side operations
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook endpoint secret

## Email Services
- `SMTP_HOST`: Email server hostname
- `SMTP_PORT`: Email server port
- `SMTP_USER`: Email username
- `SMTP_PASS`: Email password
- `FROM_EMAIL`: Default sender email address

## File Storage
- `UPLOAD_PATH`: Local path for file uploads
- `MAX_FILE_SIZE`: Maximum file size for uploads (in bytes)

## Analytics
- `GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID
- `FACEBOOK_PIXEL_ID`: Facebook Pixel ID (optional)

## Example .env.local file
```env
# Database
DATABASE_URL=./bangobongo.db

# Auth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Ditto Music
DITTO_API_KEY=your-ditto-api-key
DITTO_API_SECRET=your-ditto-api-secret  
DITTO_ARTIST_ID=your-artist-id
DITTO_BASE_URL=https://api.dittomusic.com/v1

# Shopify
SHOPIFY_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_...
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
SHOPIFY_WEBHOOK_SECRET=whsec_...

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@bangobongo.com

# Uploads
UPLOAD_PATH=./public/uploads
MAX_FILE_SIZE=52428800

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

See `.env.example` for a template.
