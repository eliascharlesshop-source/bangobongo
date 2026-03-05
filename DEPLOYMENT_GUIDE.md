# BangoBongo Deployment Guide

## 1. Monitor Vercel Deployment

### Check Deployment Status
1. Go to [Vercel Dashboard](https://vercel.com/bangobongo-ece)
2. Find your `bangobongo` project
3. Click on the latest deployment
4. Monitor the build logs

### Expected Build Time
- First build: 3-5 minutes
- Subsequent builds: 1-3 minutes (with optimizations)

### What to Look For
✅ Build successful
✅ No compilation errors
✅ Deployment URL generated

---

## 2. Configure Shopify Integration

### Step 1: Get Shopify Credentials

#### A. Shopify Domain
Your store domain (e.g., `your-store.myshopify.com`)

#### B. Storefront Access Token
1. Go to your Shopify Admin
2. Navigate to: **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **Create an app** (or select existing app)
4. Name it: "BangoBongo Website"
5. Go to **Configuration** tab
6. Under **Storefront API**, click **Configure**
7. Enable these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
8. Click **Save**
9. Go to **API credentials** tab
10. Copy the **Storefront access token**

#### C. Admin Access Token (Optional - for admin features)
1. In the same app, go to **Configuration** tab
2. Under **Admin API**, click **Configure**
3. Enable these scopes:
   - `read_products`
   - `write_products`
   - `read_orders`
   - `write_orders`
4. Click **Save**
5. Go to **API credentials** tab
6. Click **Install app**
7. Copy the **Admin API access token**

### Step 2: Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/bangobongo-ece)
2. Select your `bangobongo` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
SHOPIFY_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token_here
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token_here (optional)
```

5. Select environments: **Production**, **Preview**, **Development**
6. Click **Save**

### Step 3: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **Redeploy**
4. Wait for the new deployment to complete

---

## 3. Configure Other Services (Optional)

### Stripe Payment Integration

Add to Vercel environment variables:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### JWT Authentication

Add to Vercel environment variables:
```
JWT_SECRET=your_random_secret_key_here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### Ditto Music Integration (Optional)

Add to Vercel environment variables:
```
DITTO_API_KEY=your_ditto_api_key
DITTO_API_SECRET=your_ditto_api_secret
```

---

## 4. Fix Database (Optional)

### Option A: Use Node v20 LTS (Recommended)

1. Install nvm if you don't have it:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

2. Install and use Node v20:
```bash
nvm install 20
nvm use 20
```

3. Reinstall dependencies:
```bash
pnpm install
```

4. Restore database module:
```bash
mv lib/db/index-with-sqlite.ts lib/db/index.ts
```

5. Initialize database:
```bash
npm run init-db
```

### Option B: Keep Current Setup (Shopify-only)

The app works fine without local database if you:
- Configure Shopify for products
- Use external music streaming links
- Don't need local data storage

---

## 5. Verify Deployment

### Check These URLs

1. **Homepage**: https://bangobongo.vercel.app
2. **Music Page**: https://bangobongo.vercel.app/music
3. **Merch Page**: https://bangobongo.vercel.app/merch
4. **API Status**: https://bangobongo.vercel.app/api/status

### Expected Behavior

✅ Logo displays correctly (BangoBongo-Trans.png)
✅ Favicon shows in browser tab
✅ No console errors
✅ Products load from Shopify (if configured)
✅ Music page shows (empty if no data)

---

## 6. Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Look for TypeScript or syntax errors
- Verify all imports are correct

### Products Don't Show
- Verify Shopify environment variables are set
- Check Shopify API credentials are valid
- Ensure products are published in Shopify

### Logo Doesn't Display
- Verify `/public/logo/BangoBongo-Trans.png` exists
- Check browser console for 404 errors
- Clear browser cache

### Database Errors
- Expected if using Node v25
- Either downgrade to Node v20 or use Shopify-only mode
- Check `DATABASE_SETUP.md` for details

---

## 7. Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Domains**
3. Add your custom domain: `bangobongo.com`
4. Follow Vercel's DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

---

## Quick Commands

```bash
# Check deployment status
vercel ls

# Deploy to production
vercel --prod

# View logs
vercel logs

# Check environment variables
vercel env ls
```

---

## Support

- Vercel Docs: https://vercel.com/docs
- Shopify API Docs: https://shopify.dev/docs/api
- Next.js Docs: https://nextjs.org/docs

---

**Last Updated**: March 5, 2026
