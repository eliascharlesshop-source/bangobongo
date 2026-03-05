import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join } from 'path'
import { mkdirSync, existsSync } from 'fs'

// Database connection
let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!db) {
    try {
      // Create data directory if it doesn't exist
      const dataDir = join(process.cwd(), 'data')
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true })
      }

      // Create database file in the data directory
      const dbPath = join(dataDir, 'bangobongo.db')
      db = new Database(dbPath)

      // Enable foreign keys
      db.pragma('foreign_keys = ON')
    } catch (error) {
      console.error('Database initialization error:', error)
      console.warn('Running without local database - using Shopify only')
      // Return a mock database object that throws on use
      throw new Error('Database not available. Please configure Shopify integration or rebuild better-sqlite3.')
    }
  }

  return db
}

export function initializeDatabase() {
  if (!db) {
    // Create database file in the data directory
    const dbPath = join(process.cwd(), 'data', 'bangobongo.db')
    db = new Database(dbPath)

    // Enable foreign keys
    db.pragma('foreign_keys = ON')
  }

  try {
    // Read and execute schema
    const schemaPath = join(process.cwd(), 'lib', 'db', 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    db.exec(schema)

    // Seed initial data if tables are empty
    seedInitialData()

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

function seedInitialData() {
  if (!db) return

  try {
    // Check if we already have data
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
    if (userCount.count > 0) return // Already seeded

    // Seed categories only
    const insertCategory = db.prepare(`
      INSERT INTO categories (id, name, slug, description) 
      VALUES (?, ?, ?, ?)
    `)

    const categories = [
      ['clothing', 'Clothing', 'clothing', 'T-shirts, hoodies, and apparel'],
      ['accessories', 'Accessories', 'accessories', 'Hats, bags, and other accessories'],
      ['vinyl', 'Vinyl Records', 'vinyl', 'Vinyl albums and EPs'],
      ['digital', 'Digital Downloads', 'digital', 'Digital music and content'],
      ['poster', 'Posters & Art', 'poster', 'Posters and artwork'],
      ['tour', 'Tour Merchandise', 'tour', 'Exclusive tour items'],
      ['limited', 'Limited Edition', 'limited', 'Limited edition collectibles'],
      ['collection', 'Collections & Bundles', 'collection', 'Product bundles and collections']
    ]

    categories.forEach(category => insertCategory.run(...category))

    console.log('Initial categories seeded successfully')
  } catch (error) {
    console.error('Error seeding initial data:', error)
  }
}

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

// Utility function to run migrations
export function runMigrations() {
  // This can be expanded to handle database migrations
  initializeDatabase()
}