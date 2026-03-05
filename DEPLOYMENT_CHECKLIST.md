# BangoBongo Deployment Checklist

## Pre-Deployment ✅

- [x] Logo updated to BangoBongo-Trans.png
- [x] Favicon configured
- [x] Build optimizations applied
- [x] Database gracefully handles errors
- [x] API routes fixed
- [x] Code pushed to GitHub

## Vercel Deployment 🚀

### 1. Monitor Build
- [ ] Go to https://vercel.com/bangobongo-ece
- [ ] Find `bangobongo` project
- [ ] Check latest deployment status
- [ ] Verify build completes successfully

### 2. Configure Environment Variables

#### Required Variables
- [ ] `SHOPIFY_DOMAIN` - Your Shopify store domain
- [ ] `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Storefront API token
- [ ] `JWT_SECRET` - Random 32+ character string

#### Optional Variables
- [ ] `SHOPIFY_ADMIN_ACCESS_TOKEN` - Admin API token (for admin features)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_PUBLISHABLE_KEY` - Stripe public key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- [ ] `DITTO_API_KEY` - Ditto Music API key
- [ ] `DITTO_API_SECRET` - Ditto Music API secret

### 3. Redeploy After Adding Variables
- [ ] Go to Deployments tab
- [ ] Click three dots on latest deployment
- [ ] Click "Redeploy"
- [ ] Wait for completion

## Post-Deployment Testing 🧪

### Visual Checks
- [ ] Logo displays in navbar
- [ ] Logo displays in footer
- [ ] Favicon shows in browser tab
- [ ] Mobile responsive design works
- [ ] Dark/light theme toggle works

### Functionality Checks
- [ ] Homepage loads without errors
- [ ] Music page loads (may be empty)
- [ ] Merch page loads products (if Shopify configured)
- [ ] Tour page loads
- [ ] Gear page loads
- [ ] Cart functionality works
- [ ] Navigation works on mobile

### API Checks
- [ ] Visit `/api/status` - should return system status
- [ ] Check browser console for errors
- [ ] Verify no 500 errors in Network tab

## Shopify Setup (If Using Products) 🛍️

### Create Shopify App
- [ ] Go to Shopify Admin
- [ ] Settings → Apps and sales channels → Develop apps
- [ ] Create new app: "BangoBongo Website"

### Configure Storefront API
- [ ] Enable `unauthenticated_read_product_listings`
- [ ] Enable `unauthenticated_read_product_inventory`
- [ ] Enable `unauthenticated_read_product_tags`
- [ ] Copy Storefront access token

### Configure Admin API (Optional)
- [ ] Enable `read_products`
- [ ] Enable `write_products`
- [ ] Enable `read_orders`
- [ ] Enable `write_orders`
- [ ] Install app
- [ ] Copy Admin API access token

### Add Products
- [ ] Create products in Shopify
- [ ] Publish to "Online Store" channel
- [ ] Verify products appear on site

## Database Setup (Optional) 💾

### If You Need Local Database
- [ ] Install Node v20 LTS: `nvm install 20 && nvm use 20`
- [ ] Reinstall dependencies: `pnpm install`
- [ ] Restore database: `mv lib/db/index-with-sqlite.ts lib/db/index.ts`
- [ ] Initialize database: `npm run init-db`
- [ ] Test locally: `npm run dev`

### If Using Shopify-Only Mode
- [ ] Verify Shopify is configured
- [ ] Accept that music/tours will be empty until added via admin
- [ ] Products will come from Shopify

## Custom Domain (Optional) 🌐

- [ ] Go to Vercel → Settings → Domains
- [ ] Add custom domain
- [ ] Configure DNS records
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate

## Security 🔒

- [ ] All environment variables are set in Vercel (not in code)
- [ ] JWT_SECRET is strong and random
- [ ] API keys are kept secret
- [ ] HTTPS is enabled (automatic with Vercel)

## Performance 🚄

- [ ] Check Lighthouse score
- [ ] Verify images are optimized
- [ ] Test on mobile devices
- [ ] Check page load times

## Final Verification ✨

- [ ] Visit production URL
- [ ] Test all major features
- [ ] Check on different browsers
- [ ] Test on mobile
- [ ] Share with team for feedback

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/bangobongo-ece
- **Production URL**: https://bangobongo.vercel.app
- **Shopify Admin**: https://admin.shopify.com
- **GitHub Repo**: https://github.com/elicharlese/bangobongo

---

## Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions on each step.
