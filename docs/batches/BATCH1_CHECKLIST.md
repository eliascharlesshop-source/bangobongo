# Batch 1 Feature Checklist

## Music & Audio Features
- [ ] Add music and beats catalog
- [ ] Implement music player functionality
- [ ] Create music expanded version view
- [ ] Add hover button interactions for music controls

## Visual Enhancements
- [ ] Implement gradient images throughout the UI
- [ ] Update album art and visual assets

## E-commerce Integration
- [ ] Build out Music items UI (currently no loading)
- [ ] Build out Tour items UI (currently no loading)
- [ ] Build out Gear items UI (currently no loading)
- [ ] Build out Merch items UI (currently no loading)
- [ ] Connect to Shopify for product data
- [ ] Add demo products for development/testing
- [ ] Use Shopify CLI for local development setup

## UI/UX Components
- [ ] Implement mini menu navigation
- [ ] Add hover button effects
- [ ] Ensure all product sections load properly

## Payment Systems
- [ ] Integrate Stripe payment processing
- [ ] Add cryptocurrency payment options
- [ ] Implement payment flow UI components

## Quality Assurance
- [ ] Test music player functionality across devices
- [ ] Verify Shopify product loading
- [ ] Test payment integrations
- [ ] Ensure responsive design for all new features

## Project Structure & Infrastructure
- [x] Encapsulate Shopify theme under `shopify-theme/` directory
- [x] Move SQLite database to `data/bangobongo.db` and add it to .gitignore
- [x] Remove legacy `styles/` directory and rely on `app/globals.css` for global styles