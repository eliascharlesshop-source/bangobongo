# Shopify App Setup Guide for BangoBongo

## Required Admin API Scopes

When creating your Shopify app, enable these permissions:

### Product Management
- `read_products` - Read product catalog
- `write_products` - Create/update products from BangoBongo
- `read_product_listings` - Access storefront products
- `write_product_listings` - Manage storefront visibility

### Inventory Management  
- `read_inventory` - Check stock levels
- `write_inventory` - Update inventory when products are synced

### Order Management
- `read_orders` - Access order data
- `write_orders` - Create orders (if needed)
- `read_fulfillments` - Track shipments
- `write_fulfillments` - Update fulfillment status

### Customer Data
- `read_customers` - Access customer information
- `write_customers` - Create customer accounts

### Analytics
- `read_analytics` - Access sales analytics
- `read_reports` - Generate performance reports

## Required Storefront API Scopes

For the customer-facing integration:

### Essential Scopes
- `unauthenticated_read_products` - Public product access
- `unauthenticated_read_product_listings` - Storefront product visibility
- `unauthenticated_write_checkouts` - Cart and checkout functionality
- `unauthenticated_read_checkouts` - Access checkout data

### Optional but Recommended
- `unauthenticated_read_product_inventory` - Real-time stock levels
- `unauthenticated_read_product_pickup_locations` - Store locations
- `unauthenticated_read_selling_plans` - Subscription products (if applicable)

## Webhook Endpoints (Optional but Recommended)

Configure these webhooks to keep BangoBongo in sync:

### Order Events
- `orders/create` - New order notifications
- `orders/updated` - Order status changes
- `orders/paid` - Payment confirmations
- `orders/cancelled` - Order cancellations

### Product Events  
- `products/create` - New product added
- `products/update` - Product changes
- `inventory_levels/update` - Stock changes

### Customer Events
- `customers/create` - New customer registration
- `customers/update` - Customer data changes

## Webhook URL Format
```
https://your-bangobongo-domain.com/api/shopify/webhooks/[event_type]
```

Example:
```
https://bangobongo.com/api/shopify/webhooks/orders/create
```

## Security Notes

1. **Webhook Verification**: Always verify webhook signatures using SHOPIFY_WEBHOOK_SECRET
2. **Rate Limiting**: Shopify has API rate limits (40 requests/app/second)
3. **HTTPS Required**: All API endpoints must use HTTPS
4. **Token Security**: Store API tokens securely in environment variables

## Testing Your Integration

### 1. Test Storefront API
```bash
curl -X POST https://your-store.myshopify.com/api/2024-01/graphql.json \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: YOUR_STOREFRONT_TOKEN" \
  -d '{"query": "{ shop { name } }"}'
```

### 2. Test Admin API  
```bash
curl -X GET https://your-store.myshopify.com/admin/api/2024-01/products.json \
  -H "X-Shopify-Access-Token: YOUR_ADMIN_TOKEN"
```

### 3. Test Product Creation
```bash
curl -X POST https://your-store.myshopify.com/admin/api/2024-01/products.json \
  -H "X-Shopify-Access-Token: YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "title": "BangoBongo Test Product",
      "body_html": "Test product from BangoBongo",
      "vendor": "BangoBongo",
      "product_type": "Merchandise"
    }
  }'
```
