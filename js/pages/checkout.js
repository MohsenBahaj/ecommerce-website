import '../components/navbar.js';
import { authService } from '../services/auth.service.js';
import { cartService } from '../services/cart.service.js';
import { orderService } from '../services/order.service.js';
import { profileService } from '../services/profile.service.js';
import { formatPrice, showToast } from '../utils/helpers.js';

/**
 * Initialize checkout page
 */
function initCheckoutPage() {
  // Check authentication
  if (!authService.isAuthenticated()) {
    showToast('Please login to checkout', 'error');
    window.location.href = '/pages/login.html';
    return;
  }

  // Check cart
  const cartItems = cartService.getCartWithDetails();
  if (cartItems.length === 0) {
    showToast('Your cart is empty', 'error');
    window.location.href = '/pages/cart.html';
    return;
  }

  renderCheckout();
}

/**
 * Render checkout page
 */
function renderCheckout() {
  const container = document.getElementById('checkoutContent');
  if (!container) return;

  const cartItems = cartService.getCartWithDetails();
  const total = cartService.getCartTotal();
  const addresses = profileService.getAddresses();
  const defaultAddress = profileService.getDefaultAddress();

  container.innerHTML = `
    <div class="cart-layout">
      <div>
        <!-- Delivery Address -->
        <div class="card card-elevated mb-lg">
          <h3 class="mb-md">Delivery Address</h3>
          
          ${addresses.length > 0 ? `
            <div id="addressSelection">
              ${addresses.map(addr => `
                <div class="form-checkbox mb-sm">
                  <input 
                    type="radio" 
                    name="address" 
                    value="${addr.id}" 
                    id="addr${addr.id}"
                    ${addr.isDefault ? 'checked' : ''}
                  >
                  <label for="addr${addr.id}">
                    ${addr.street}, ${addr.city}${addr.district ? `, ${addr.district}` : ''}
                    ${addr.isDefault ? ' <strong>(Default)</strong>' : ''}
                  </label>
                </div>
              `).join('')}
            </div>
            
            <a href="/pages/addresses.html" class="btn btn-ghost btn-sm mt-md">
              Manage Addresses
            </a>
          ` : `
            <p class="mb-md" style="color: var(--text-secondary);">
              No addresses saved. Please add an address first.
            </p>
            <a href="/pages/addresses.html" class="btn btn-primary">
              Add Address
            </a>
          `}
        </div>

        <!-- Order Items -->
        <div class="card card-elevated">
          <h3 class="mb-md">Order Items (${cartItems.length})</h3>
          ${cartItems.map(item => `
            <div class="order-item">
              <img src="${item.product.image}" alt="${item.product.name}" class="order-item-img">
              <div>
                <p style="font-weight: var(--font-weight-semibold); color: var(--text-primary);">
                  ${item.product.name}
                </p>
                <p style="color: var(--text-tertiary); font-size: var(--font-size-sm);">
                  Qty: ${item.quantity}
                </p>
              </div>
              <p style="font-weight: var(--font-weight-semibold); color: var(--primary-light);">
                ${formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Order Summary -->
      <div class="cart-summary">
        <h3 class="cart-summary-title">Order Summary</h3>
        
        <div class="cart-summary-row">
          <span>Subtotal</span>
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

        <button 
          class="btn btn-primary btn-lg" 
          id="placeOrderBtn" 
          ${addresses.length === 0 ? 'disabled' : ''}
          style="width: 100%; margin-top: var(--spacing-lg);"
        >
          Place Order
        </button>
        
        <a href="/pages/cart.html" class="btn btn-ghost" style="width: 100%; margin-top: var(--spacing-md);">
          Back to Cart
        </a>
      </div>
    </div>
  `;

  attachCheckoutEventListeners();
}

/**
 * Attach checkout event listeners
 */
function attachCheckoutEventListeners() {
  document.getElementById('placeOrderBtn')?.addEventListener('click', handlePlaceOrder);
}

/**
 * Handle place order
 */
function handlePlaceOrder() {
  const selectedAddressId = document.querySelector('input[name="address"]:checked')?.value;
  
  if (!selectedAddressId) {
    showToast('Please select a delivery address', 'error');
    return;
  }

  const addresses = profileService.getAddresses();
  const selectedAddress = addresses.find(a => a.id === parseInt(selectedAddressId));
  
  if (!selectedAddress) {
    showToast('Invalid address selected', 'error');
    return;
  }

  const cartItems = cartService.getCartWithDetails();
  const total = cartService.getCartTotal();

  const order = orderService.createOrder(cartItems, selectedAddress, total);
  
  // Clear cart
  cartService.clearCart();
  
  showToast('Order placed successfully!', 'success');
  
  setTimeout(() => {
    window.location.href = `/pages/orders.html`;
  }, 1500);
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckoutPage);
} else {
  initCheckoutPage();
}
