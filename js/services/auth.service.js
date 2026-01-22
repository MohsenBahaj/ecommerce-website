import { DEMO_USER } from '../data/user.js';
import { STORAGE_KEYS } from '../data/constants.js';
import { storageService } from './storage.service.js';

/**
 * Authentication service for login, logout, and session management
 */
class AuthService {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} { success: boolean, message: string, user?: Object }
   */
  login(email, password) {
    // Validate against hardcoded user
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      // Create session (excluding password)
      const session = {
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        loginTime: new Date().toISOString()
      };
      
      storageService.set(STORAGE_KEYS.AUTH_SESSION, session);
      
      // Store user data (for profile updates)
      this.saveUserData({
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        addresses: DEMO_USER.addresses
      });
      
      return {
        success: true,
        message: 'Login successful',
        user: session
      };
    }
    
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }

  /**
   * Logout current user
   */
  logout() {
    storageService.remove(STORAGE_KEYS.AUTH_SESSION);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const session = storageService.get(STORAGE_KEYS.AUTH_SESSION);
    return session !== null;
  }

  /**
   * Get current user session
   * @returns {Object|null} User session or null
   */
  getCurrentUser() {
    return storageService.get(STORAGE_KEYS.AUTH_SESSION);
  }

  /**
   * Get full user data (including addresses)
   * @returns {Object|null}
   */
  getUserData() {
    return storageService.get(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Save user data
   * @param {Object} userData - User data to save
   */
  saveUserData(userData) {
    storageService.set(STORAGE_KEYS.USER_DATA, userData);
  }
}

export const authService = new AuthService();
