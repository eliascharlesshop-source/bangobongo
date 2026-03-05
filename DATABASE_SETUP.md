# Database Setup

## Current Status

The local database (better-sqlite3) is currently **disabled** due to compilation issues with Node.js v25.6.0.

The app is running in **Shopify-only mode**, which means:
- All products come from Shopify
- No local database storage
- Requires Shopify configuration to display products

## To Re-enable Local Database

### Option 1: Use Node.js LTS (Recommended)

1. Install Node.js v20 LTS using nvm:
   ```bash
   nvm install 20
   nvm use 20
   ```

2. Reinstall dependencies:
   ```bash
   pnpm install
   ```

3. Restore the database module:
   ```bash
   mv lib/db/index-with-sqlite.ts lib/db/index.ts
   ```

4. Add better-sqlite3:
   ```bash
   pnpm add better-sqlite3
   ```

5. Initialize the database:
   ```bash
   npm run init-db
   ```

### Option 2: Fix C++ Compilation (Advanced)

If you must use Node v25, ensure you have:
- Xcode Command Line Tools: `xcode-select --install`
- Compatible C++ compiler
- Then try: `pnpm rebuild better-sqlite3`

## Shopify Configuration

To use Shopify products, set these environment variables:

```env
SHOPIFY_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token
```

## Current Workaround

The app gracefully handles missing database by:
1. Attempting to fetch from Shopify first
2. Showing helpful error messages if both fail
3. Allowing the app to run without crashing

## Files Modified

- `lib/db/index.ts` - Disabled version (current)
- `lib/db/index-with-sqlite.ts` - Full version with better-sqlite3
- `app/api/products/route.ts` - Handles missing database gracefully
