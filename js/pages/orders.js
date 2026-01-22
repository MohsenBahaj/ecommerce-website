import '../components/navbar.js';
import { authService } from '../services/auth.service.js';
import { orderService } from '../services/order.service.js';
import { formatPrice, formatDate, showToast } from '../utils/helpers.js';

/**
 * Initialize orders page
 */
function initOrdersPage() {
  // Check authentication
  if (!authService.isAuthenticated()) {
    showToast('Please login to view orders', 'error');
    window.location.href = '/pages/login.html';
    return;
  }

  renderOrders();
}

/**
 * Render orders
 */
function renderOrders() {
  const container = document.getElementById('ordersContainer');
  if (!container) return;

  const orders = orderService.getOrders();

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <h3 class="empty-state-title">No orders yet</h3>
        <p class="empty-state-text">Start shopping to see your orders here!</p>
        <a href="/pages/products.html" class="btn btn-primary btn-lg">
          Browse Products
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => renderOrderCard(order)).join('');
  attachOrderEventListeners();
}

/**
 * Render single order card
 */
function renderOrderCard(order) {
  const statusInfo = orderService.getStatusInfo(order.status);
  const canCancel = orderService.canCancelOrder(order);
  const canReturn = orderService.canReturnOrder(order);

  return `
    <div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-id">Order #${order.id}</div>
          <div class="order-date">${formatDate(order.createdAt)}</div>
        </div>
        <div class="order-status badge ${statusInfo.class}">
          ${statusInfo.label}
        </div>
      </div>

      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item">
            <img src="${item.productImage}" alt="${item.productName}" class="order-item-img">
            <div>
              <p style="font-weight: var(--font-weight-semibold); color: var(--text-primary);">
                ${item.productName}
              </p>
              <p style="color: var(--text-tertiary); font-size: var(--font-size-sm);">
                Qty: ${item.quantity} × ${formatPrice(item.price)}
              </p>
            </div>
            <p style="font-weight: var(--font-weight-semibold); color: var(--primary-light);">
              ${formatPrice(item.price * item.quantity)}
            </p>
          </div>
        `).join('')}
      </div>

      <div class="order-footer">
        <div class="order-total">
          Total: ${formatPrice(order.total)}
        </div>
        <div class="order-actions">
          ${canCancel ? `
            <button class="btn btn-error btn-sm cancel-order" data-order-id="${order.id}">
              Cancel Order
            </button>
          ` : ''}
          ${canReturn ? `
            <button class="btn btn-warning btn-sm return-order" data-order-id="${order.id}">
              Return Order
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Attach order event listeners
 */
function attachOrderEventListeners() {
  // Cancel order
  document.querySelectorAll('.cancel-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.dataset.orderId;
      if (confirm('Are you sure you want to cancel this order?')) {
        const result = orderService.cancelOrder(orderId);
        if (result.success) {
          showToast('Order cancelled successfully', 'success');
          renderOrders();
        } else {
          showToast(result.message, 'error');
        }
      }
    });
  });

  // Return order
  document.querySelectorAll('.return-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.dataset.orderId;
      if (confirm('Are you sure you want to return this order?')) {
        const result = orderService.returnOrder(orderId);
        if (result.success) {
          showToast('Return request submitted', 'success');
          renderOrders();
        } else {
          showToast(result.message, 'error');
        }
      }
    });
  });
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOrdersPage);
} else {
  initOrdersPage();
}
