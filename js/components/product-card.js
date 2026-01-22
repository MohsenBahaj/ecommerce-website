import { products } from '../data/products.js';
import { cartService } from '../services/cart.service.js';
import { formatPrice, createStarRating, showToast } from '../utils/helpers.js';
import { updateCartBadge } from './navbar.js';

/**
 * Create product card HTML
 * @param {Object} product - Product object
 * @returns {string} HTML string
 */
export function createProductCard(product) {
  return `
    <div class="product-card">
      <div class="product-card-img-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy">
        <div class="product-card-badges">
          ${product.isNew ? '<span class="badge badge-new">New</span>' : ''}
          ${product.isFeatured ? '<span class="badge badge-featured">Featured</span>' : ''}
        </div>
      </div>
      <div class="product-card-body">
        <h3 class="product-card-title">
          <a href="/pages/product-details.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-card-rating">
          <div class="rating">
            ${createStarRating(product.rating)}
          </div>
          <span class="rating-value">${product.rating.toFixed(1)}</span>
        </div>
        <div class="product-card-price">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ''}
        </div>
        <p class="product-card-stock">
          ${product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
        </p>
        <div class="product-card-footer">
          <button 
            class="btn btn-primary" 
            onclick="window.addToCartFromCard(${product.id})"
            ${product.stock === 0 ? 'disabled' : ''}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render products grid
 * @param {Array} productsList - Array of products
 * @param {HTMLElement} container - Container element
 */
export function renderProductsGrid(productsList, container) {
  if (!container) return;

  if (productsList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <h3 class="empty-state-title">No products found</h3>
        <p class="empty-state-text">Try adjusting your filters or search query</p>
      </div>
    `;
    return;
  }

  container.innerHTML = productsList.map(product => createProductCard(product)).join('');
}

/**
 * Add to cart from product card
 * @param {number} productId - Product ID
 */
window.addToCartFromCard = function(productId) {
  const result = cartService.addToCart(productId, 1);
  
  if (result.success) {
    showToast('Product added to cart!', 'success');
    updateCartBadge();
  } else {
    showToast(result.message, 'error');
  }
};
