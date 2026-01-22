import '../components/navbar.js';
import { renderProductsGrid } from '../components/product-card.js';
import { combineFilters, sortProducts } from '../utils/filters.js';
import { categories } from '../data/categories.js';
import { debounce, getQueryParam } from '../utils/helpers.js';

let currentFilters = {
  searchQuery: '',
  categoryId: null,
  minPrice: null,
  maxPrice: null
};

let currentSort = '';

/**
 * Initialize products page
 */
function initProductsPage() {
  // Get initial search query from URL
  const searchQuery = getQueryParam('search');
  if (searchQuery) {
    currentFilters.searchQuery = searchQuery;
  }

  renderCategoryFilters();
  attachEventListeners();
  updateProducts();
}

/**
 * Render category filters
 */
function renderCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;

  const allOption = container.querySelector('[data-category=""]');
  
  categories.forEach(category => {
    const link = document.createElement('a');
    link.href = '#';
    link.className = 'filter-option';
    link.dataset.category = category.id;
    link.textContent = category.name;
    container.appendChild(link);
  });
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
  // Category filter clicks
  document.getElementById('categoryFilters')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-option')) {
      e.preventDefault();
      
      // Update active state
      document.querySelectorAll('#categoryFilters .filter-option').forEach(opt => {
        opt.classList.remove('active');
      });
      e.target.classList.add('active');
      
      // Update filter
      const categoryId = e.target.dataset.category;
      currentFilters.categoryId = categoryId || null;
      updateProducts();
    }
  });

  // Price filter
  document.getElementById('applyPriceFilter')?.addEventListener('click', () => {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    
    currentFilters.minPrice = minPrice || null;
    currentFilters.maxPrice = maxPrice || null;
    updateProducts();
  });

  // Clear filters
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    currentFilters = {
      searchQuery: '',
      categoryId: null,
      minPrice: null,
      maxPrice: null
    };
    currentSort = '';
    
    // Reset UI
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortSelect').value = '';
    document.querySelectorAll('#categoryFilters .filter-option').forEach(opt => {
      opt.classList.remove('active');
    });
    document.querySelector('#categoryFilters .filter-option').classList.add('active');
    
    updateProducts();
  });

  // Sort
  document.getElementById('sortSelect')?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    updateProducts();
  });
}

/**
 * Update products display
 */
function updateProducts() {
  let filteredProducts = combineFilters(currentFilters);
  
  if (currentSort) {
    filteredProducts = sortProducts(filteredProducts, currentSort);
  }

  const container = document.getElementById('productsGrid');
  const countEl = document.getElementById('productsCount');
  
  if (countEl) {
    countEl.textContent = `${filteredProducts.length} products found`;
  }
  
  renderProductsGrid(filteredProducts, container);
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductsPage);
} else {
  initProductsPage();
}
