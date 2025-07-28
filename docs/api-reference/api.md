# API Reference

The API is organized by resource. All endpoints are prefixed with `/api/`.

## Authentication
- `POST /api/auth/login` — User login
- `POST /api/auth/register` — User registration

## Music
- `GET /api/music` — List all music tracks
- `GET /api/music/:id` — Get details for a track
- `POST /api/music` — Upload new track (admin only)
- `PUT /api/music/:id` — Update track details (admin only)
- `DELETE /api/music/:id` — Remove track (admin only)

## Products
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get product details
- `POST /api/products` — Create new product (admin only)
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Remove product (admin only)

## Orders
- `POST /api/orders` — Create a new order
- `GET /api/orders` — List user orders
- `GET /api/orders/:id` — Get order details
- `PUT /api/orders/:id` — Update order status (admin only)

## Cart
- `GET /api/cart` — Get user's cart
- `POST /api/cart` — Add item to cart
- `PUT /api/cart/:id` — Update cart item
- `DELETE /api/cart/:id` — Remove cart item

## Licensing (New)
- `GET /api/licenses` — Get license tiers and pricing
- `POST /api/licenses` — Purchase a beat license
- `GET /api/licenses/:id` — Get license details
- `GET /api/licenses/:id/download` — Download licensed track
- `GET /api/licenses/:id/contract` — Download license contract

## Ditto Music Integration (New)
- `POST /api/ditto` — Distribute track to Ditto Music
- `GET /api/ditto?releaseId=:id` — Get distribution status
- `GET /api/ditto?trackId=:id` — Get distribution analytics
- `PUT /api/ditto/:releaseId` — Update release metadata
- `DELETE /api/ditto/:releaseId` — Remove from distribution

## Categories
- `GET /api/categories` — List all categories
- `POST /api/categories` — Create new category (admin only)

## Tours
- `GET /api/tours` — List upcoming tour dates
- `POST /api/tours` — Add new tour date (admin only)
- `PUT /api/tours/:id` — Update tour date (admin only)
- `DELETE /api/tours/:id` — Remove tour date (admin only)

## Payments
- `POST /api/payments/stripe` — Process Stripe payment
- `POST /api/payments/crypto` — Process crypto payment
- `GET /api/payments/:id` — Get payment status

## Admin
- `GET /api/admin/dashboard` — Get admin dashboard data
- `GET /api/admin/analytics` — Get platform analytics
- `GET /api/admin/users` — List all users (admin only)

## License Types

### Basic License ($35)
- Non-exclusive rights
- Up to 2,000 streams/downloads  
- No major label distribution
- Producer credit required
- 2-year lease period

### Premium License ($100)
- Non-exclusive rights
- Up to 10,000 streams/downloads
- Limited distribution rights
- Producer credit required  
- 3-year lease period

### Trackout License ($250)
- Non-exclusive rights
- Includes trackout/stems
- Up to 20,000 streams/downloads
- Full distribution rights
- 5-year lease period

### Unlimited License ($350)
- Non-exclusive rights
- Unlimited streams/downloads
- Full commercial rights
- Lifetime license
- Producer credit required

### Exclusive License ($2500+)
- Exclusive rights
- Unlimited usage
- Track removed from store
- Producer credit optional
- Perpetual license

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Rate Limiting

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- License downloads: 10 per hour per license

...and more. See source code for full details.
