-- SUPABASE DATABASE SETUP SCRIPT
-- Execute this script in the Supabase SQL Editor once your project is active.

-- 1. Create Tables
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category TEXT,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id), -- Nullable if allowing guest checkouts
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',
    razorpay_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL
);

-- 2. Setup Row Level Security (RLS) policies
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read, only authenticated admin can write (assuming we create an admin boolean on profiles, but for simplicity here we just check if authed for insert, or we disable write from normal users entirely and only allow Service Role).
CREATE POLICY "Products are viewable by everyone." 
ON products FOR SELECT 
USING (true);

-- Orders: Users can only see their own orders. Authenticated users can insert orders.
CREATE POLICY "Users can insert their own orders." 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders." 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

-- Same for Order Items
CREATE POLICY "Users can view their own order items."
ON order_items FOR SELECT
USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
));

CREATE POLICY "Users can insert their order items."
ON order_items FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
));

-- 3. Insert mock data
INSERT INTO products (name, description, price, category, stock, image_url)
VALUES 
('Quantum Mechanical Keyboard', 'A premium mechanical keyboard with hot-swappable switches, RGB backlit glass keycaps, and a sleek anodized aluminum frame.', 189.99, 'Electronics', 45, 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800'),
('Neon Horizon Desk Mat', 'An ultra-smooth, spill-proof desk mat featuring a futuristic synthwave design.', 34.00, 'Accessories', 120, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800'),
('Aurora Wireless Mouse', 'Ergonomic wireless gaming mouse with a 20k DPI optical sensor and 70-hour battery life.', 89.50, 'Electronics', 30, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800'),
('Studio Noise-Canceling Headphones', 'Immersive over-ear headphones with active noise cancellation and spatial audio support.', 249.99, 'Audio', 15, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'),
('CyberDeck Ultra Monitor', 'A stunning 34-inch ultrawide OLED curved display with 240Hz refresh rate. Zero bezel design.', 899.99, 'Monitors', 10, 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&q=80&w=800'),
('Titan Ergonomic Chair', 'Fully adjustable ergonomic mesh chair designed for extreme 14-hour coding sessions.', 349.00, 'Furniture', 25, 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800'),
('Holographic LED Lamp', 'A mesmerizing smart LED desk lamp that syncs with your IDE and music.', 45.00, 'Accessories', 80, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'),
('Vortex VR Headset', 'Next-generation virtual reality headset built for absolute immersive simulation. Features haptic feedback.', 499.99, 'Electronics', 5, 'https://images.unsplash.com/photo-1622979135240-caa6e95bb307?auto=format&fit=crop&q=80&w=800');
