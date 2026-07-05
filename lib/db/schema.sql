-- BangoBongo Store Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    wallet_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    crypto_price DECIMAL(18,8),
    category_id TEXT,
    image_url TEXT,
    images TEXT, -- JSON array of image URLs
    sizes TEXT, -- JSON array of available sizes
    colors TEXT, -- JSON array of available colors
    tags TEXT, -- JSON array of tags
    in_stock BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_limited BOOLEAN DEFAULT false,
    discount_percentage INTEGER DEFAULT 0,
    related_album TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    cover_url TEXT,
    type TEXT DEFAULT 'album' CHECK (type IN ('album', 'ep', 'single')),
    artist TEXT DEFAULT 'BangoBongo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Music table (General music catalog)
CREATE TABLE IF NOT EXISTS music (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    genre TEXT,
    release_date DATE,
    duration INTEGER, -- in seconds
    track_number INTEGER,
    audio_url TEXT,
    preview_url TEXT,
    cover_art TEXT,
    lyrics TEXT,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    price DECIMAL(10,2),
    crypto_price DECIMAL(18,8),
    streaming_links TEXT, -- JSON object with streaming platform links
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tracks table (Updated for licensing)
CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    album_id TEXT,
    track_number INTEGER,
    album_art_url TEXT,
    artist TEXT DEFAULT 'BangoBongo',
    release_date DATE,
    is_explicit BOOLEAN DEFAULT false,
    category TEXT DEFAULT 'original' CHECK (category IN ('original', 'licensed', 'beat')),
    license_type TEXT CHECK (license_type IN ('basic', 'premium', 'trackout', 'unlimited', 'exclusive')),
    price DECIMAL(10,2),
    bpm INTEGER,
    musical_key TEXT,
    genre TEXT,
    tags TEXT, -- JSON array of tags
    trackout_included BOOLEAN DEFAULT false,
    ditto_release_id TEXT,
    is_distributed BOOLEAN DEFAULT false,
    audio_file_url TEXT,
    preview_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (album_id) REFERENCES albums(id)
);

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
    id TEXT PRIMARY KEY,
    license_type TEXT NOT NULL CHECK (license_type IN ('basic', 'premium', 'trackout', 'unlimited', 'exclusive')),
    track_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATETIME,
    usage_rights TEXT NOT NULL, -- JSON object with rights details
    credit_required BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    stream_count INTEGER DEFAULT 0,
    contract_terms TEXT NOT NULL,
    contract_url TEXT,
    download_url TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (track_id) REFERENCES tracks(id),
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Ditto Music releases table
CREATE TABLE IF NOT EXISTS ditto_releases (
    id TEXT PRIMARY KEY,
    track_id TEXT NOT NULL,
    ditto_release_id TEXT UNIQUE,
    release_title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'live', 'failed', 'rejected')),
    distribution_date DATE,
    platforms TEXT, -- JSON array of distribution platforms
    analytics_streams INTEGER DEFAULT 0,
    analytics_revenue DECIMAL(10,2) DEFAULT 0,
    analytics_territories TEXT, -- JSON array of territories
    last_sync DATETIME,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (track_id) REFERENCES tracks(id)
);

-- License usage tracking table
CREATE TABLE IF NOT EXISTS license_usage (
    id TEXT PRIMARY KEY,
    license_id TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('download', 'stream', 'sync_use', 'commercial_use')),
    platform TEXT,
    ip_address TEXT,
    user_agent TEXT,
    metadata TEXT, -- JSON object with additional data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (license_id) REFERENCES licenses(id)
);

-- Beat analytics table
CREATE TABLE IF NOT EXISTS beat_analytics (
    id TEXT PRIMARY KEY,
    track_id TEXT NOT NULL,
    date DATE NOT NULL,
    plays INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    unique_listeners INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (track_id) REFERENCES tracks(id),
    UNIQUE(track_id, date)
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    selected_size TEXT,
    selected_color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id, selected_size, selected_color)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('usd', 'crypto')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    crypto_total DECIMAL(18,8),
    shipping_address TEXT, -- JSON object
    billing_address TEXT, -- JSON object
    tracking_number TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    crypto_price DECIMAL(18,8),
    selected_size TEXT,
    selected_color TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    amount DECIMAL(10,2),
    crypto_amount DECIMAL(18,8),
    currency TEXT DEFAULT 'USD',
    crypto_currency TEXT DEFAULT 'ETH',
    transaction_id TEXT,
    wallet_address TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_limited ON products(is_limited);
CREATE INDEX IF NOT EXISTS idx_tracks_album ON tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_tracks_category ON tracks(category);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
CREATE INDEX IF NOT EXISTS idx_tracks_bpm ON tracks(bpm);
CREATE INDEX IF NOT EXISTS idx_tracks_price ON tracks(price);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_licenses_track ON licenses(track_id);
CREATE INDEX IF NOT EXISTS idx_licenses_customer ON licenses(customer_id);
CREATE INDEX IF NOT EXISTS idx_licenses_type ON licenses(license_type);
CREATE INDEX IF NOT EXISTS idx_licenses_active ON licenses(is_active);
CREATE INDEX IF NOT EXISTS idx_ditto_releases_track ON ditto_releases(track_id);
CREATE INDEX IF NOT EXISTS idx_ditto_releases_status ON ditto_releases(status);
CREATE INDEX IF NOT EXISTS idx_license_usage_license ON license_usage(license_id);
CREATE INDEX IF NOT EXISTS idx_beat_analytics_track ON beat_analytics(track_id);
CREATE INDEX IF NOT EXISTS idx_beat_analytics_date ON beat_analytics(date);
