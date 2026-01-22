import { authService } from '../services/auth.service.js';
import { cartService } from '../services/cart.service.js';
import { categories } from '../data/categories.js';

/**
 * Initialize and render navbar
 */
export function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  navbar.innerHTML = renderNavbar();
  attachNavbarEvents();
  updateCartBadge();
}

/**
 * Render navbar HTML
 */
function renderNavbar() {
  const isAuth = authService.isAuthenticated();
  const user = authService.getCurrentUser();
  const cartCount = cartService.getCartCount();

  return `
    <div class="container navbar-container">
      <a href="/index.html" class="navbar-brand">
        <span>🛍️ ShopHub</span>
      </a>

      <ul class="navbar-menu">
        <li><a href="/pages/products.html" class="navbar-link">Products</a></li>
        <li class="dropdown" id="categoriesDropdown">
          <a href="#" class="navbar-link dropdown-toggle">Categories</a>
          <div class="dropdown-menu">
            ${categories.map(cat => `
              <a href="/pages/category.html?id=${cat.id}" class="dropdown-item">${cat.name}</a>
            `).join('')}
          </div>
        </li>
       <li><a href="/pages/about.html" class="navbar-link">About</a></li>
      </ul>

      <div class="navbar-actions">
        <div class="navbar-search">
          <input type="text" id="navSearchInput" placeholder="Search...">
        </div>

        <a href="/pages/cart.html" class="btn btn-icon btn-ghost cart-badge">
          🛒
          ${cartCount > 0 ? `<span class="cart-badge-count">${cartCount}</span>` : ''}
        </a>

        ${isAuth ? `
          <div class="dropdown" id="userDropdown">
            <button class="btn btn-secondary dropdown-toggle">
              Hello, ${user.name}
            </button>
            <div class="dropdown-menu">
              <a href="/pages/profile.html" class="dropdown-item">Profile</a>
              <a href="/pages/orders.html" class="dropdown-item">Orders</a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
            </div>
          </div>
        ` : `
          <a href="/pages/login.html" class="btn btn-primary">Login</a>
          <a href="/pages/signup.html" class="btn btn-outline">Sign Up</a>
        `}
      </div>

      <button class="navbar-toggle" id="navToggle">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  `;
}

/**
 * Attach navbar event listeners
 */
function attachNavbarEvents() {
  // Categories dropdown
  const categoriesDropdown = document.getElementById('categoriesDropdown');
  if (categoriesDropdown) {
    const toggle = categoriesDropdown.querySelector('.dropdown-toggle');
    toggle?.addEventListener('click', (e) => {
      e.preventDefault();
      categoriesDropdown.classList.toggle('open');
    });
  }

  // User dropdown
  const userDropdown = document.getElementById('userDropdown');
  if (userDropdown) {
    const toggle = userDropdown.querySelector('.dropdown-toggle');
    toggle?.addEventListener('click', (e) => {
      e.preventDefault();
      userDropdown.classList.toggle('open');
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }

  // Search input
  const searchInput = document.getElementById('navSearchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch(e.target.value);
      }
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    }
  });
}

/**
 * Handle logout
 */
function handleLogout() {
  authService.logout();
  window.location.href = '/index.html';
}

/**
 * Handle search
 */
function handleSearch(query) {
  if (query.trim()) {
    window.location.href = `/pages/products.html?search=${encodeURIComponent(query)}`;
  }
}

/**
 * Update cart badge count
 */
export function updateCartBadge() {
  const cartCount = cartService.getCartCount();
  const badge = document.querySelector('.cart-badge-count');
  const cartBadgeContainer = document.querySelector('.cart-badge');

  if (cartCount > 0) {
    if (badge) {
      badge.textContent = cartCount;
    } else {
      const newBadge = document.createElement('span');
      newBadge.className = 'cart-badge-count';
      newBadge.textContent = cartCount;
      cartBadgeContainer?.appendChild(newBadge);
    }
  } else {
    badge?.remove();
  }
}

// Initialize navbar when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}
