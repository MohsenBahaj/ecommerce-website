import { authService } from './auth.service.js';

/**
 * Profile and address management service
 */
class ProfileService {
  /**
   * Update user name
   * @param {string} name - New name
   * @returns {Object} { success: boolean, message: string }
   */
  updateName(name) {
    if (!name || name.trim().length === 0) {
      return { success: false, message: 'Name cannot be empty' };
    }

    const userData = authService.getUserData();
    
    if (!userData) {
      return { success: false, message: 'User not found' };
    }

    userData.name = name.trim();
    authService.saveUserData(userData);

    // Update session as well
    const session = authService.getCurrentUser();
    if (session) {
      session.name = name.trim();
      authService.saveUserData(userData);
    }

    return { success: true, message: 'Name updated successfully' };
  }

  /**
   * Get all addresses
   * @returns {Array} Array of addresses
   */
  getAddresses() {
    const userData = authService.getUserData();
    return userData?.addresses || [];
  }

  /**
   * Add new address
   * @param {Object} address - Address object
   * @returns {Object} { success: boolean, message: string, address?: Object }
   */
  addAddress(address) {
    const userData = authService.getUserData();
    
    if (!userData) {
      return { success: false, message: 'User not found' };
    }

    // Validate address fields
    if (!address.city || !address.street) {
      return { 
        success: false, 
        message: 'City and street are required' 
      };
    }

    const addresses = userData.addresses || [];
    
    // Generate new ID
    const newId = addresses.length > 0 
      ? Math.max(...addresses.map(a => a.id)) + 1 
      : 1;

    const newAddress = {
      id: newId,
      city: address.city.trim(),
      street: address.street.trim(),
      district: address.district?.trim() || '',
      buildingNumber: address.buildingNumber?.trim() || '',
      postalCode: address.postalCode?.trim() || '',
      isDefault: addresses.length === 0 // First address is default
    };

    addresses.push(newAddress);
    userData.addresses = addresses;
    authService.saveUserData(userData);

    return { 
      success: true, 
      message: 'Address added successfully',
      address: newAddress
    };
  }

  /**
   * Set default address
   * @param {number} addressId - Address ID
   * @returns {Object} { success: boolean, message: string }
   */
  setDefaultAddress(addressId) {
    const userData = authService.getUserData();
    
    if (!userData) {
      return { success: false, message: 'User not found' };
    }

    const addresses = userData.addresses || [];
    const address = addresses.find(a => a.id === addressId);

    if (!address) {
      return { success: false, message: 'Address not found' };
    }

    // Remove default from all addresses
    addresses.forEach(a => a.isDefault = false);
    
    // Set new default
    address.isDefault = true;
    
    userData.addresses = addresses;
    authService.saveUserData(userData);

    return { success: true, message: 'Default address updated' };
  }

  /**
   * Delete address
   * @param {number} addressId - Address ID
   * @returns {Object} { success: boolean, message: string }
   */
  deleteAddress(addressId) {
    const userData = authService.getUserData();
    
    if (!userData) {
      return { success: false, message: 'User not found' };
    }

    const addresses = userData.addresses || [];
    const address = addresses.find(a => a.id === addressId);

    if (!address) {
      return { success: false, message: 'Address not found' };
    }

    if (address.isDefault) {
      return { 
        success: false, 
        message: 'Cannot delete default address. Set another address as default first.' 
      };
    }

    userData.addresses = addresses.filter(a => a.id !== addressId);
    authService.saveUserData(userData);

    return { success: true, message: 'Address deleted successfully' };
  }

  /**
   * Get default address
   * @returns {Object|null} Default address or null
   */
  getDefaultAddress() {
    const addresses = this.getAddresses();
    return addresses.find(a => a.isDefault) || null;
  }
}

export const profileService = new ProfileService();
