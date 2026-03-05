import { initializeDatabase } from '../lib/db'
import { createUser, hashPassword } from '../lib/auth'

async function initDB() {
  try {
    console.log('Initializing database...')

    // Initialize database with schema
    initializeDatabase()
    console.log('✅ Database schema created')

    // Create default admin user
    try {
      await createUser({
        email: 'admin@bangobongo.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User'
      })

      // Update role to admin
      const { getDatabase } = require('../lib/db')
      const db = getDatabase()
      db.prepare('UPDATE users SET role = ? WHERE email = ?').run('admin', 'admin@bangobongo.com')

      console.log('✅ Default admin user created (admin@bangobongo.com / admin123)')
    } catch (error: any) {
      if (error.message === 'User already exists') {
        console.log('ℹ️  Admin user already exists')
      } else {
        throw error
      }
    }

    // Create default categories
    const { v4: uuidv4 } = require('uuid')
    const db = require('../lib/db').getDatabase()

    const categories = [
      { name: 'T-Shirts', slug: 't-shirts', description: 'Comfortable cotton t-shirts with unique designs' },
      { name: 'Hoodies', slug: 'hoodies', description: 'Warm and cozy hoodies for all seasons' },
      { name: 'Accessories', slug: 'accessories', description: 'Hats, bags, and other accessories' },
      { name: 'Vinyl Records', slug: 'vinyl', description: 'Limited edition vinyl records' },
      { name: 'Digital Music', slug: 'digital', description: 'Digital downloads and streaming' },
      { name: 'Posters', slug: 'posters', description: 'Art prints and posters' }
    ]

    for (const category of categories) {
      try {
        const categoryId = uuidv4()
        db.prepare(`
          INSERT INTO categories (id, name, slug, description, is_active)
          VALUES (?, ?, ?, ?, 1)
        `).run(categoryId, category.name, category.slug, category.description)
        console.log(`✅ Created category: ${category.name}`)
      } catch (error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`ℹ️  Category already exists: ${category.name}`)
        } else {
          throw error
        }
      }
    }

    console.log('\n🎉 Database initialization complete!')
    console.log('\nNext steps:')
    console.log('1. Copy .env.example to .env and configure your environment variables')
    console.log('2. Set up your Stripe keys for payment processing')
    console.log('3. Run the development server: npm run dev')
    console.log('4. Access admin panel at /admin with admin@bangobongo.com / admin123')

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  }
}

initDB()