import '../components/navbar.js';
import { renderProductsGrid } from '../components/product-card.js';
import { getFeaturedProducts, getNewProducts } from '../utils/filters.js';
import { categories } from '../data/categories.js';

/**
 * Initialize home page
 */
function initHomePage() {
  // Optional: Redirect to login if not authenticated
  // Uncomment the lines below if you want to require login for the home page
  // if (!authService.isAuthenticated()) {
  //   window.location.href = '/pages/login.html';
  //   return;
  // }

  renderHeroSection();
  renderFeaturedProducts();
  renderNewProducts();
  renderCategories();
}

/**
 * Render hero section with search
 */
function renderHeroSection() {
  const heroSearchBtn = document.getElementById('heroSearchBtn');
  const heroSearchInput = document.getElementById('heroSearchInput');

  if (heroSearchBtn && heroSearchInput) {
    heroSearchBtn.addEventListener('click', () => {
      const query = heroSearchInput.value.trim();
      if (query) {
        window.location.href = `/pages/products.html?search=${encodeURIComponent(query)}`;
      }
    });

    heroSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        heroSearchBtn.click();
      }
    });
  }
}

/**
 * Render featured products
 */
function renderFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  const featured = getFeaturedProducts().slice(0, 8);
  renderProductsGrid(featured, container);
}

/**
 * Render new products
 */
function renderNewProducts() {
  const container = document.getElementById('newProducts');
  const newProducts = getNewProducts().slice(0, 8);
  renderProductsGrid(newProducts, container);
}

/**
 * Render categories grid
 */
function renderCategories() {
  const container = document.getElementById('categoriesGrid');
  if (!container) return;

  container.innerHTML = categories.map(category => `
    <a href="/pages/category.html?id=${category.id}" class="category-card">
      <img src="${category.image}" alt="${category.name}" class="category-card-img">
      <div class="category-card-overlay">
        <h3 class="category-card-title">${category.name}</h3>
      </div>
    </a>
  `).join('');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomePage);
} else {
  initHomePage();
}
