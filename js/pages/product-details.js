import '../components/navbar.js';
import { updateCartBadge } from '../components/navbar.js';
import { products } from '../data/products.js';
import { cartService } from '../services/cart.service.js';
import { formatPrice, createStarRating, showToast, getQueryParam } from '../utils/helpers.js';
import { APP_CONFIG } from '../data/constants.js';

let currentProduct = null;
let quantity = 1;

/**
 * Initialize product details page
 */
function initProductDetailsPage() {
  const productId = parseInt(getQueryParam('id'));
  
  if (!productId) {
    window.location.href = '/pages/404.html';
    return;
  }

  currentProduct = products.find(p => p.id === productId);
  
  if (!currentProduct) {
    window.location.href = '/pages/404.html';
    return;
  }

  renderProductDetails();
  attachEventListeners();
}

/**
 * Render product details
 */
function renderProductDetails() {
  const container = document.getElementById('productDetailsContainer');
  if (!container) return;

  document.title = `${currentProduct.name} - ShopHub`;

  container.innerHTML = `
    <div class="product-details">
      <div class="product-image-main">
        <img src="${currentProduct.image}" alt="${currentProduct.name}">
      </div>

      <div class="product-info">
        <h1 class="product-info-title">${currentProduct.name}</h1>
        
        <div class="product-info-rating">
          <div class="rating">
            ${createStarRating(currentProduct.rating)}
          </div>
          <span class="rating-value">${currentProduct.rating.toFixed(1)} out of 5</span>
        </div>

        <div class="product-info-price">
          <span class="product-info-price-current">${formatPrice(currentProduct.price)}</span>
          ${currentProduct.oldPrice ? `
            <span class="product-info-price-old">${formatPrice(currentProduct.oldPrice)}</span>
          ` : ''}
        </div>

        <div class="product-info-stock">
          ${currentProduct.stock > 0 
            ? `✅ In Stock: ${currentProduct.stock} units available` 
            : '❌ Out of Stock'}
        </div>

        <p class="product-info-description">${currentProduct.description}</p>

        ${currentProduct.stock > 0 ? `
          <div class="product-info-quantity">
            <label style="font-weight: var(--font-weight-semibold);">Quantity:</label>
            <div class="quantity-controls">
              <button class="quantity-btn" id="decreaseQty">-</button>
              <span class="quantity-value" id="quantityValue">${quantity}</span>
              <button class="quantity-btn" id="increaseQty">+</button>
            </div>
          </div>

          <div style="display: flex; gap: var(--spacing-md);">
            <button class="btn btn-primary btn-lg" id="addToCartBtn" style="flex: 1;">
              Add to Cart
            </button>
            <button class="btn btn-outline btn-lg" onclick="window.history.back()">
              Back
            </button>
          </div>
        ` : `
          <button class="btn btn-secondary btn-lg" disabled style="width: 100%;">
            Out of Stock
          </button>
        `}
      </div>
    </div>
  `;
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
  document.getElementById('decreaseQty')?.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      updateQuantityDisplay();
    }
  });

  document.getElementById('increaseQty')?.addEventListener('click', () => {
    if (quantity < currentProduct.stock && quantity < APP_CONFIG.MAX_CART_QUANTITY) {
      quantity++;
      updateQuantityDisplay();
    }
  });

  document.getElementById('addToCartBtn')?.addEventListener('click', handleAddToCart);
}

/**
 * Update quantity display
 */
function updateQuantityDisplay() {
  const qtyEl = document.getElementById('quantityValue');
  if (qtyEl) {
    qtyEl.textContent = quantity;
  }
}

/**
 * Handle add to cart
 */
function handleAddToCart() {
  const result = cartService.addToCart(currentProduct.id, quantity);
  
  if (result.success) {
    showToast(`Added ${quantity} item(s) to cart!`, 'success');
    updateCartBadge();
    quantity = 1;
    updateQuantityDisplay();
  } else {
    showToast(result.message, 'error');
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductDetailsPage);
} else {
  initProductDetailsPage();
}
