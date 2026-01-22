import { STORAGE_KEYS, ORDER_STATUS } from '../data/constants.js';
import { storageService } from './storage.service.js';

/**
 * Order management service
 */
class OrderService {
  /**
   * Get all orders
   * @returns {Array} Array of orders
   */
  getOrders() {
    return storageService.get(STORAGE_KEYS.ORDERS, []);
  }

  /**
   * Save orders to storage
   * @param {Array} orders - Orders array
   */
  _saveOrders(orders) {
    storageService.set(STORAGE_KEYS.ORDERS, orders);
  }

  /**
   * Generate unique order ID
   * @returns {string} Order ID
   */
  _generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Create new order from cart
   * @param {Array} cartItems - Cart items with product details
   * @param {Object} address - Delivery address
   * @param {number} total - Order total
   * @returns {Object} Created order
   */
  createOrder(cartItems, address, total) {
    const order = {
      id: this._generateOrderId(),
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.image,
        price: item.product.price,
        quantity: item.quantity
      })),
      address: { ...address },
      total,
      status: ORDER_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const orders = this.getOrders();
    orders.unshift(order); // Add to beginning
    this._saveOrders(orders);

    return order;
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Object|null} Order or null
   */
  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(order => order.id === orderId) || null;
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Object} { success: boolean, message: string }
   */
  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);

    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    // Validate status transition
    if (!Object.values(ORDER_STATUS).includes(status)) {
      return { success: false, message: 'Invalid status' };
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    this._saveOrders(orders);
    return { success: true, message: 'Order status updated' };
  }

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   * @returns {Object} { success: boolean, message: string }
   */
  cancelOrder(orderId) {
    const order = this.getOrderById(orderId);

    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    if (!this.canCancelOrder(order)) {
      return { 
        success: false, 
        message: 'This order cannot be cancelled' 
      };
    }

    return this.updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);
  }

  /**
   * Return order
   * @param {string} orderId - Order ID
   * @returns {Object} { success: boolean, message: string }
   */
  returnOrder(orderId) {
    const order = this.getOrderById(orderId);

    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    if (!this.canReturnOrder(order)) {
      return { 
        success: false, 
        message: 'This order cannot be returned' 
      };
    }

    return this.updateOrderStatus(orderId, ORDER_STATUS.RETURNED);
  }

  /**
   * Check if order can be cancelled
   * @param {Object} order - Order object
   * @returns {boolean}
   */
  canCancelOrder(order) {
    return order.status === ORDER_STATUS.PENDING;
  }

  /**
   * Check if order can be returned
   * @param {Object} order - Order object
   * @returns {boolean}
   */
  canReturnOrder(order) {
    return order.status === ORDER_STATUS.DELIVERED;
  }

  /**
   * Get order status display info
   * @param {string} status - Order status
   * @returns {Object} { label: string, class: string }
   */
  getStatusInfo(status) {
    const statusMap = {
      [ORDER_STATUS.PENDING]: { label: 'Pending', class: 'status-pending' },
      [ORDER_STATUS.SHIPPED]: { label: 'Shipped', class: 'status-shipped' },
      [ORDER_STATUS.DELIVERED]: { label: 'Delivered', class: 'status-delivered' },
      [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', class: 'status-cancelled' },
      [ORDER_STATUS.RETURNED]: { label: 'Returned', class: 'status-returned' }
    };

    return statusMap[status] || { label: status, class: '' };
  }
}

export const orderService = new OrderService();
