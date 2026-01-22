import { STORAGE_KEYS, APP_CONFIG } from '../data/constants.js';
import { storageService } from './storage.service.js';
import { products } from '../data/products.js';

/**
 * Shopping cart service
 */
class CartService {
  /**
   * Get cart items from storage
   * @returns {Array} Array of cart items
   */
  getCart() {
    return storageService.get(STORAGE_KEYS.CART, []);
  }

  /**
   * Save cart to storage
   * @param {Array} cart - Cart items
   */
  _saveCart(cart) {
    storageService.set(STORAGE_KEYS.CART, cart);
  }

  /**
   * Add product to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Object} { success: boolean, message: string }
   */
  addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    if (product.stock < quantity) {
      return { success: false, message: 'Insufficient stock' };
    }

    const cart = this.getCart();
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > APP_CONFIG.MAX_CART_QUANTITY) {
        return { 
          success: false, 
          message: `Maximum quantity is ${APP_CONFIG.MAX_CART_QUANTITY}` 
        };
      }

      if (newQuantity > product.stock) {
        return { success: false, message: 'Insufficient stock' };
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    this._saveCart(cart);
    return { success: true, message: 'Added to cart' };
  }

  /**
   * Update quantity of a cart item
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {Object} { success: boolean, message: string }
   */
  updateQuantity(productId, quantity) {
    if (quantity < 1) {
      return this.removeFromCart(productId);
    }

    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    if (quantity > APP_CONFIG.MAX_CART_QUANTITY) {
      return { 
        success: false, 
        message: `Maximum quantity is ${APP_CONFIG.MAX_CART_QUANTITY}` 
      };
    }

    if (quantity > product.stock) {
      return { success: false, message: 'Insufficient stock' };
    }

    const cart = this.getCart();
    const item = cart.find(item => item.productId === productId);

    if (!item) {
      return { success: false, message: 'Item not in cart' };
    }

    item.quantity = quantity;
    this._saveCart(cart);
    
    return { success: true, message: 'Quantity updated' };
  }

  /**
   * Remove item from cart
   * @param {number} productId - Product ID
   * @returns {Object} { success: boolean, message: string }
   */
  removeFromCart(productId) {
    const cart = this.getCart();
    const filteredCart = cart.filter(item => item.productId !== productId);
    
    this._saveCart(filteredCart);
    return { success: true, message: 'Item removed' };
  }

  /**
   * Get cart with full product details
   * @returns {Array} Cart items with product details
   */
  getCartWithDetails() {
    const cart = this.getCart();
    return cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product
      };
    }).filter(item => item.product); // Filter out items where product no longer exists
  }

  /**
   * Get total cart count
   * @returns {number} Total number of items
   */
  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get cart total price
   * @returns {number} Total price
   */
  getCartTotal() {
    const cartWithDetails = this.getCartWithDetails();
    return cartWithDetails.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  /**
   * Clear entire cart
   */
  clearCart() {
    this._saveCart([]);
  }
}

export const cartService = new CartService();
