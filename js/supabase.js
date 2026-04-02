/* Setup Supabase Configuration
 * Because this code runs in the browser, we use the Supabase CDN via JavaScript modules,
 * or simply define the placeholders. Since the user doesn't have keys yet,
 * we will build a robust mock layer that fakes the backend while leaving the exact integration ready.
 */

const SUPABASE_URL = 'https://dklcickcsgxvdekwhomd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbGNpa2NzZ3hndmRla3dob21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDYwODIsImV4cCI6MjA5MDcyMjA4Mn0.1-XQgGTNK-fY5Rfwhyywe-kx1mreZQO8wyXsW3bcY-0';

// Mock database to simulate Supabase functionality
const mockDB = {
    products: [
        {
            id: 'p1',
            name: 'Quantum Mechanical Keyboard',
            price: 189.99,
            description: 'A premium mechanical keyboard with hot-swappable switches, RGB backlit glass keycaps, and a sleek anodized aluminum frame.',
            image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
            category: 'Electronics',
            stock: 45
        },
        {
            id: 'p2',
            name: 'Neon Horizon Desk Mat',
            price: 34.00,
            description: 'An ultra-smooth, spill-proof desk mat featuring a futuristic synthwave design.',
            image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
            category: 'Accessories',
            stock: 120
        },
        {
            id: 'p3',
            name: 'Aurora Wireless Mouse',
            price: 89.50,
            description: 'Ergonomic wireless gaming mouse with a 20k DPI optical sensor and 70-hour battery life.',
            image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
            category: 'Electronics',
            stock: 30
        },
        {
            id: 'p4',
            name: 'Studio Noise-Canceling Headphones',
            price: 249.99,
            description: 'Immersive over-ear headphones with active noise cancellation and spatial audio support.',
            image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
            category: 'Audio',
            stock: 15
        }
    ],
    users: [],
    orders: []
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const supabaseApi = {
    // Simulate fetching products
    from: (table) => {
        return {
            select: async (query) => {
                await delay(500); // simulate network
                if (table === 'products') {
                    return { data: mockDB.products, error: null };
                }
                return { data: [], error: null };
            },
            insert: async (dataItem) => {
                await delay(800);
                if (table === 'orders') {
                    const newOrder = { ...dataItem[0], id: 'ord_' + Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
                    mockDB.orders.push(newOrder);
                    return { data: [newOrder], error: null };
                }
                return { data: null, error: 'Table not found' };
            }
        }
    },
    auth: {
        signUp: async ({ email, password }) => {
            await delay(1000);
            return { data: { user: { id: 'usr_123', email } }, error: null };
        },
        signInWithPassword: async ({ email, password }) => {
            await delay(1000);
            return { data: { user: { id: 'usr_123', email } }, error: null };
        },
        signOut: async () => {
            await delay(300);
            return { error: null };
        },
        getSession: async () => {
            return { data: { session: null }, error: null };
        }
    }
};

window.supabase = supabaseApi;
