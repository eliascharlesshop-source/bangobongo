import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join } from 'path'

// Database connection
let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!db) {
    // Create database file in the project root
    const dbPath = join(process.cwd(), 'bangobongo.db')
    db = new Database(dbPath)
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON')
  }
  
  return db
}

export function initializeDatabase() {
  if (!db) {
    // Create database file in the project root
    const dbPath = join(process.cwd(), 'bangobongo.db')
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
    
    // Seed categories
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
    
    // Seed admin user
    const bcrypt = require('bcryptjs')
    const { v4: uuidv4 } = require('uuid')
    
    const adminId = uuidv4()
    const hashedPassword = bcrypt.hashSync('admin123', 10)
    
    db.prepare(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(adminId, 'admin@bangobongo.com', hashedPassword, 'Admin', 'User', 'admin')
    
    // Seed albums
    const insertAlbum = db.prepare(`
      INSERT INTO albums (id, title, year, cover_url, type)
      VALUES (?, ?, ?, ?, ?)
    `)
    
    const albums = [
      ['album1', 'Neon Nights', 2023, '/placeholder.svg?height=400&width=400', 'album'],
      ['album2', 'Digital Dreamscape', 2022, '/placeholder.svg?height=400&width=400', 'album'],
      ['album3', 'Cosmic Beats', 2021, '/placeholder.svg?height=400&width=400', 'album']
    ]
    
    albums.forEach(album => insertAlbum.run(...album))
    
    console.log('Initial data seeded successfully')
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