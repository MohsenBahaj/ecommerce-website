import '../components/navbar.js';
import { renderProductsGrid } from '../components/product-card.js';
import { getCategoryById, getProductsByCategory } from '../utils/filters.js';
import { getQueryParam } from '../utils/helpers.js';

/**
 * Initialize category page
 */
function initCategoryPage() {
  const categoryId = parseInt(getQueryParam('id'));
  
  if (!categoryId) {
    window.location.href = '/pages/404.html';
    return;
  }

  const category = getCategoryById(categoryId);
  
  if (!category) {
    window.location.href = '/pages/404.html';
    return;
  }

  const products = getProductsByCategory(categoryId);
  
  renderCategoryHeader(category, products.length);
  renderProducts(products);
}

/**
 * Render category header
 */
function renderCategoryHeader(category, productCount) {
  const container = document.getElementById('categoryHeader');
  if (!container) return;

  document.title = `${category.name} - ShopHub`;

  container.innerHTML = `
    <h1 class="page-title">${category.name}</h1>
    <p class="page-subtitle">${category.description}</p>
    <p style="color: var(--text-tertiary); margin-top: var(--spacing-sm);">
      ${productCount} products available
    </p>
  `;
}

/**
 * Render products
 */
function renderProducts(products) {
  const container = document.getElementById('productsGrid');
  renderProductsGrid(products, container);
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCategoryPage);
} else {
  initCategoryPage();
}
