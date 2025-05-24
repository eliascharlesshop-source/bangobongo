# BangoBongo API

This directory contains the backend API routes for the BangoBongo music artist store.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize the database:**
   ```bash
   npm run init-db
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📁 API Structure

### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products (`/api/products`)
- `GET /api/products` - List products (with filtering)
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Shopping Cart (`/api/cart`)
- `GET /api/cart` - Get user's cart
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove cart item

### Orders (`/api/orders`)
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### Music (`/api/music`)
- `GET /api/music` - List music tracks
- `POST /api/music` - Add music track (admin only)

### Tours (`/api/tours`)
- `GET /api/tours` - List tour dates
- `POST /api/tours` - Add tour date (admin only)

### Categories (`/api/categories`)
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin only)

### Payments (`/api/payments`)
- `POST /api/payments/stripe` - Create Stripe payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

### Admin (`/api/admin`)
- `GET /api/admin/dashboard` - Admin dashboard statistics

## 🔐 Authentication

The API uses JWT tokens for authentication with the following features:
- HTTP-only cookies for secure token storage
- Role-based access control (user/admin)
- 7-day token expiration
- Automatic token refresh

### Usage Examples

**Register a new user:**
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  })
})
```

**Login:**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
```

## 🛒 E-commerce Features

### Product Management
- Full CRUD operations
- Image upload support
- Inventory tracking
- Discount/sale pricing
- Multiple variants (size, color)
- Category organization

### Shopping Cart
- Persistent cart storage
- Quantity management
- Size/color selection
- Real-time price calculation

### Order Processing
- Complete order workflow
- Multiple payment methods (Stripe, crypto)
- Order status tracking
- Shipping address management
- Order history

### Payment Processing
- Stripe integration for credit cards
- Crypto payment support
- Webhook handling for payment status
- Secure payment intent creation

## 🎵 Music Features

### Music Catalog
- Track management
- Album organization
- Genre categorization
- Streaming links integration
- Digital download support
- Preview functionality

### Tour Management
- Tour date scheduling
- Venue information
- Ticket pricing (USD/crypto)
- Capacity management
- Age restrictions

## 🗄️ Database Schema

The API uses SQLite with the following main tables:

- **users** - User accounts and authentication
- **products** - Product catalog
- **categories** - Product categories
- **cart_items** - Shopping cart storage
- **orders** - Order records
- **order_items** - Order line items
- **music** - Music track catalog
- **tours** - Tour dates and venues

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="./data/bangobongo.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Default Admin Account

After running `npm run init-db`, you can access the admin panel with:
- **Email:** admin@bangobongo.com
- **Password:** admin123

⚠️ **Important:** Change the default admin password in production!

## 📊 Admin Dashboard

The admin dashboard provides:
- Real-time sales statistics
- User management
- Product inventory
- Order tracking
- Revenue analytics
- Music catalog management
- Tour scheduling

## 🚀 Deployment

### Production Setup

1. **Set production environment variables**
2. **Initialize production database:**
   ```bash
   NODE_ENV=production npm run init-db
   ```
3. **Build the application:**
   ```bash
   npm run build
   ```
4. **Start production server:**
   ```bash
   npm start
   ```

### Security Considerations

- Use strong JWT secrets in production
- Enable HTTPS for all API endpoints
- Configure proper CORS settings
- Set up rate limiting
- Use environment variables for sensitive data
- Regular security updates

## 🧪 Testing

The API includes comprehensive error handling and validation:
- Input validation using Zod schemas
- Consistent error response format
- Authentication middleware
- Database transaction safety

## 📝 API Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "data": { "errors": ["Validation error 1", "Validation error 2"] }
}
```

## 🔄 Database Management

### Reset Database
```bash
npm run db:reset
```

### Manual Database Operations
```bash
# Access SQLite CLI
sqlite3 data/bangobongo.db

# View tables
.tables

# View schema
.schema users
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Validate all inputs
5. Test API endpoints thoroughly
6. Update documentation

## 📞 Support

For issues or questions about the BangoBongo API, please check the documentation or create an issue in the repository.