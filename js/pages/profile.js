import '../components/navbar.js';
import { authService } from '../services/auth.service.js';
import { profileService } from '../services/profile.service.js';
import { showToast } from '../utils/helpers.js';

let currentTab = 'profile';

/**
 * Initialize profile page
 */
function initProfilePage() {
  // Check authentication
  if (!authService.isAuthenticated()) {
    showToast('Please login to view profile', 'error');
    window.location.href = '/pages/login.html';
    return;
  }

  attachTabListeners();
  showTab('profile');
}

/**
 * Attach tab listeners
 */
function attachTabListeners() {
  document.querySelectorAll('.profile-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.dataset.tab;
      
      // Update active state
      document.querySelectorAll('.profile-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      showTab(tab);
    });
  });
}

/**
 * Show tab content
 */
function showTab(tab) {
  currentTab = tab;
  
  switch (tab) {
    case 'profile':
      renderProfileTab();
      break;
    case 'addresses':
      renderAddressesTab();
      break;
  }
}

/**
 * Render profile tab
 */
function renderProfileTab() {
  const container = document.getElementById('profileContent');
  if (!container) return;

  const userData = authService.getUserData();

  container.innerHTML = `
    <h3 class="mb-lg">Profile Information</h3>
    
    <form id="profileForm">
      <div class="form-group">
        <label class="form-label" for="name">Name</label>
        <input 
          type="text" 
          id="name" 
          class="form-input" 
          value="${userData.name}"
          required
        >
      </div>

      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          class="form-input" 
          value="${userData.email}"
          disabled
          style="opacity: 0.6; cursor: not-allowed;"
        >
        <small style="color: var(--text-tertiary); font-size: var(--font-size-sm);">
          Email cannot be changed
        </small>
      </div>

      <button type="submit" class="btn btn-primary">
        Update Profile
      </button>
    </form>
  `;

  document.getElementById('profileForm')?.addEventListener('submit', handleProfileUpdate);
}

/**
 * Handle profile update
 */
function handleProfileUpdate(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const result = profileService.updateName(name);
  
  if (result.success) {
    showToast('Profile updated successfully', 'success');
    // Refresh navbar to show updated name
    window.location.reload();
  } else {
    showToast(result.message, 'error');
  }
}

/**
 * Render addresses tab
 */
function renderAddressesTab() {
  const container = document.getElementById('profileContent');
  if (!container) return;

  const addresses = profileService.getAddresses();

  container.innerHTML = `
    <div class="flex justify-between items-center mb-lg">
      <h3>My Addresses</h3>
      <button class="btn btn-primary" id="addAddressBtn">Add Address</button>
    </div>

    <div id="addressesList">
      ${addresses.length > 0 ? addresses.map(addr => renderAddressCard(addr)).join('') : `
        <div class="empty-state">
          <p>No addresses saved yet</p>
        </div>
      `}
    </div>

    <!-- Add Address Form (Hidden by default) -->
    <div id="addAddressForm" class="card card-elevated mt-lg" style="display: none;">
      <h4 class="mb-md">Add New Address</h4>
      <form id="newAddressForm">
        <div class="form-group">
          <label class="form-label">City *</label>
          <input type="text" id="city" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">Street *</label>
          <input type="text" id="street" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">District</label>
          <input type="text" id="district" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">Building Number</label>
          <input type="text" id="buildingNumber" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">Postal Code</label>
          <input type="text" id="postalCode" class="form-input">
        </div>
        <div class="flex gap-md">
          <button type="submit" class="btn btn-primary">Save Address</button>
          <button type="button" class="btn btn-ghost" id="cancelAddAddressBtn">Cancel</button>
        </div>
      </form>
    </div>
  `;

  attachAddressEventListeners();
}

/**
 * Render address card
 */
function renderAddressCard(address) {
  return `
    <div class="address-card ${address.isDefault ? 'default' : ''}">
      ${address.isDefault ? '<span class="badge badge-primary address-default-badge">Default</span>' : ''}
      
      <p style="font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-sm);">
        ${address.city}
      </p>
      <p style="color: var(--text-secondary); margin-bottom: var(--spacing-md);">
        ${address.street}${address.district ? `, ${address.district}` : ''}<br>
        ${address.buildingNumber ? `Building: ${address.buildingNumber}, ` : ''}
        ${address.postalCode ? `Postal Code: ${address.postalCode}` : ''}
      </p>
      
      <div class="flex gap-sm">
        ${!address.isDefault ? `
          <button class="btn btn-secondary btn-sm set-default-btn" data-address-id="${address.id}">
            Set as Default
          </button>
          <button class="btn btn-ghost btn-sm delete-address-btn" data-address-id="${address.id}">
            Delete
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Attach address event listeners
 */
function attachAddressEventListeners() {
  // Show add address form
  document.getElementById('addAddressBtn')?.addEventListener('click', () => {
    document.getElementById('addAddressForm').style.display = 'block';
  });

  // Hide add address form
  document.getElementById('cancelAddAddressBtn')?.addEventListener('click', () => {
    document.getElementById('addAddressForm').style.display = 'none';
    document.getElementById('newAddressForm').reset();
  });

  // Submit new address
  document.getElementById('newAddressForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const address = {
      city: document.getElementById('city').value,
      street: document.getElementById('street').value,
      district: document.getElementById('district').value,
      buildingNumber: document.getElementById('buildingNumber').value,
      postalCode: document.getElementById('postalCode').value
    };

    const result = profileService.addAddress(address);
    
    if (result.success) {
      showToast('Address added successfully', 'success');
      renderAddressesTab();
    } else {
      showToast(result.message, 'error');
    }
  });

  // Set default address
  document.querySelectorAll('.set-default-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const addressId = parseInt(btn.dataset.addressId);
      const result = profileService.setDefaultAddress(addressId);
      
      if (result.success) {
        showToast('Default address updated', 'success');
        renderAddressesTab();
      } else {
        showToast(result.message, 'error');
      }
    });
  });

  // Delete address
  document.querySelectorAll('.delete-address-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Are you sure you want to delete this address?')) return;
      
      const addressId = parseInt(btn.dataset.addressId);
      const result = profileService.deleteAddress(addressId);
      
      if (result.success) {
        showToast('Address deleted', 'success');
        renderAddressesTab();
      } else {
        showToast(result.message, 'error');
      }
    });
  });
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfilePage);
} else {
  initProfilePage();
}
