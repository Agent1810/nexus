// Core Application State
const AppState = {
    cart: JSON.parse(localStorage.getItem('ecommerce_cart')) || [],
    user: null,
    products: []
};

// Configuration
const CURRENCY = '$';

// Utility functions
const formatCurrency = (amount) => {
    return `${CURRENCY}${amount.toFixed(2)}`;
};

const showToast = (message) => {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn Right 0.3s reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Cart logic
const updateCartUI = () => {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
};

const saveCart = () => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(AppState.cart));
    updateCartUI();
};

const addToCart = (product) => {
    const existingEntry = AppState.cart.find(item => item.id === product.id);
    if (existingEntry) {
        existingEntry.quantity += 1;
    } else {
        AppState.cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showToast(`${product.name} added to cart!`);
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    updateCartUI();
    
    // Check authentication
    const { data } = await window.supabase.auth.getSession();
    if (data.session) {
        AppState.user = data.session.user;
    }
});

// Export globally if needed
window.App = {
    AppState,
    formatCurrency,
    showToast,
    addToCart,
    saveCart,
    updateCartUI
};
