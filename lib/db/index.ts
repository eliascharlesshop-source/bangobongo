// Database temporarily disabled due to better-sqlite3 compilation issues with Node v25
// To re-enable: downgrade to Node v20 LTS and run: pnpm add better-sqlite3

export function getDatabase(): any {
    throw new Error('Database not available. Please configure Shopify integration or use Node v20 LTS.')
}

export function initializeDatabase() {
    console.warn('Database disabled - using Shopify only')
}

export function closeDatabase() {
    // No-op
}

export function runMigrations() {
    console.warn('Database disabled - skipping migrations')
}
