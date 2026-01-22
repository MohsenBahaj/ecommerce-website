import '../components/navbar.js';
import { updateCartBadge } from '../components/navbar.js';
import { cartService } from '../services/cart.service.js';
import { formatPrice, showToast } from '../utils/helpers.js';

/**
 * Initialize cart page
 */
function initCartPage() {
  renderCart();
}

/**
 * Render cart
 */
function renderCart() {
  const container = document.getElementById('cartContent');
  if (!container) return;

  const cartItems = cartService.getCartWithDetails();

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <h3 class="empty-state-title">Your cart is empty</h3>
        <p class="empty-state-text">Add some products to get started!</p>
        <a href="/pages/products.html" class="btn btn-primary btn-lg">
          Browse Products
        </a>
      </div>
    `;
    return;
  }

  const total = cartService.getCartTotal();

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${cartItems.map(item => renderCartItem(item)).join('')}
      </div>

      <div class="cart-summary">
        <h3 class="cart-summary-title">Order Summary</h3>
        
        <div class="cart-summary-row">
          <span>Subtotal (${cartItems.length} items)</span>
          <span>${formatPrice(total)}</span>
        </div>
        
        <div class="cart-summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        
        <div class="cart-summary-row">
          <strong>Total</strong>
          <strong>${formatPrice(total)}</strong>
        </div>

        <a href="/pages/checkout.html" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--spacing-lg);">
          Proceed to Checkout
        </a>
        
        <a href="/pages/products.html" class="btn btn-ghost" style="width: 100%; margin-top: var(--spacing-md);">
          Continue Shopping
        </a>
      </div>
    </div>
  `;

  attachCartEventListeners();
}

/**
 * Render single cart item
 */
function renderCartItem(item) {
  return `
    <div class="cart-item" data-product-id="${item.productId}">
      <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
      
      <div class="cart-item-info">
        <h3 class="cart-item-title">${item.product.name}</h3>
        <p class="cart-item-price">${formatPrice(item.product.price)}</p>
        <p style="color: var(--text-tertiary); font-size: var(--font-size-sm);">
          Stock: ${item.product.stock}
        </p>
      </div>

      <div class="cart-item-actions">
        <div class="quantity-controls">
          <button class="quantity-btn decrease-qty" data-product-id="${item.productId}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn increase-qty" data-product-id="${item.productId}">+</button>
        </div>
        
        <button class="btn btn-ghost btn-sm remove-item" data-product-id="${item.productId}">
          Remove
        </button>
      </div>
    </div>
  `;
}

/**
 * Attach cart event listeners
 */
function attachCartEventListeners() {
  // Decrease quantity
  document.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      const cart = cartService.getCart();
      const item = cart.find(i => i.productId === productId);
      
      if (item && item.quantity > 1) {
        cartService.updateQuantity(productId, item.quantity - 1);
        renderCart();
        updateCartBadge();
      }
    });
  });

  // Increase quantity
  document.querySelectorAll('.increase-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      const result = cartService.addToCart(productId, 1);
      
      if (result.success) {
        renderCart();
        updateCartBadge();
      } else {
        showToast(result.message, 'error');
      }
    });
  });

  // Remove item
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      cartService.removeFromCart(productId);
      showToast('Item removed from cart', 'info');
      renderCart();
      updateCartBadge();
    });
  });
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCartPage);
} else {
  initCartPage();
}
