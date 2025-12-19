-- Portell Wines Database Schema
-- Initial migration for products, events, bookings, orders, and users

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  description_en TEXT,
  tasting_notes TEXT,
  tasting_notes_en TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('red', 'white', 'rose', 'sparkling', 'bundle')),
  vintage INTEGER,
  volume VARCHAR(50) DEFAULT '750ml',
  alcohol VARCHAR(50),
  region VARCHAR(255),
  grape_variety VARCHAR(255),
  image_url TEXT,
  gallery TEXT[],
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  description_en TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration VARCHAR(100),
  location VARCHAR(255) NOT NULL,
  address TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  capacity INTEGER NOT NULL,
  booked_count INTEGER DEFAULT 0,
  image_url TEXT,
  event_type VARCHAR(50) DEFAULT 'tasting' CHECK (event_type IN ('tasting', 'dinner', 'workshop', 'tour', 'special')),
  active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(active);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  guests INTEGER NOT NULL DEFAULT 1,
  special_requests TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'free', 'refunded')),
  confirmation_code VARCHAR(100) UNIQUE NOT NULL,
  gdpr_consent BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation_code ON bookings(confirmation_code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  shipping_address JSONB,
  billing_address JSONB,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) CHECK (payment_method IN ('card', 'transfer', 'cod')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  gdpr_consent BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Users/Admins Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Function to update updated_date automatically
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_date
DROP TRIGGER IF EXISTS update_products_updated_date ON products;
CREATE TRIGGER update_products_updated_date BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

DROP TRIGGER IF EXISTS update_events_updated_date ON events;
CREATE TRIGGER update_events_updated_date BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

DROP TRIGGER IF EXISTS update_bookings_updated_date ON bookings;
CREATE TRIGGER update_bookings_updated_date BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

DROP TRIGGER IF EXISTS update_orders_updated_date ON orders;
CREATE TRIGGER update_orders_updated_date BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

