import '../components/navbar.js';
import { authService } from '../services/auth.service.js';
import { showToast } from '../utils/helpers.js';

/**
 * Initialize login page
 */
function initLoginPage() {
  // Redirect if already logged in
  if (authService.isAuthenticated()) {
    window.location.href = '/index.html';
    return;
  }

  const form = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin(errorMessage);
  });
}

/**
 * Handle login form submission
 */
function handleLogin(errorMessageEl) {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const result = authService.login(email, password);

  if (result.success) {
    showToast('Login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1000);
  } else {
    errorMessageEl.textContent = result.message;
    errorMessageEl.style.display = 'block';
    showToast(result.message, 'error');
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginPage);
} else {
  initLoginPage();
}
