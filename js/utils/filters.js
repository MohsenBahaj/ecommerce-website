import { products } from '../data/products.js';
import { categories } from '../data/categories.js';

/**
 * Filter products by search query
 * @param {Array} productsList - Products to filter
 * @param {string} query - Search query
 * @returns {Array} Filtered products
 */
export function filterBySearch(productsList, query) {
  if (!query || query.trim() === '') {
    return productsList;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return productsList.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );
}

/**
 * Filter products by category
 * @param {Array} productsList - Products to filter
 * @param {number} categoryId - Category ID
 * @returns {Array} Filtered products
 */
export function filterByCategory(productsList, categoryId) {
  if (!categoryId) {
    return productsList;
  }

  return productsList.filter(product => product.categoryId === parseInt(categoryId));
}

/**
 * Filter products by price range
 * @param {Array} productsList - Products to filter
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Array} Filtered products
 */
export function filterByPriceRange(productsList, minPrice, maxPrice) {
  return productsList.filter(product => {
    const price = product.price;
    const meetsMin = minPrice === null || minPrice === '' || price >= minPrice;
    const meetsMax = maxPrice === null || maxPrice === '' || price <= maxPrice;
    return meetsMin && meetsMax;
  });
}

/**
 * Combine all filters
 * @param {Object} filters - Filter object with searchQuery, categoryId, minPrice, maxPrice
 * @returns {Array} Filtered products
 */
export function combineFilters(filters) {
  let filtered = [...products];

  // Apply search filter
  if (filters.searchQuery) {
    filtered = filterBySearch(filtered, filters.searchQuery);
  }

  // Apply category filter
  if (filters.categoryId) {
    filtered = filterByCategory(filtered, filters.categoryId);
  }

  // Apply price range filter
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    filtered = filterByPriceRange(
      filtered, 
      filters.minPrice ? parseFloat(filters.minPrice) : null,
      filters.maxPrice ? parseFloat(filters.maxPrice) : null
    );
  }

  return filtered;
}

/**
 * Get featured products
 * @returns {Array} Featured products
 */
export function getFeaturedProducts() {
  return products.filter(p => p.isFeatured);
}

/**
 * Get new products
 * @returns {Array} New products
 */
export function getNewProducts() {
  return products.filter(p => p.isNew);
}

/**
 * Sort products
 * @param {Array} productsList - Products to sort
 * @param {string} sortBy - Sort criteria (price-asc, price-desc, name, rating)
 * @returns {Array} Sorted products
 */
export function sortProducts(productsList, sortBy) {
  const sorted = [...productsList];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

/**
 * Get category by ID
 * @param {number} categoryId - Category ID
 * @returns {Object|null} Category or null
 */
export function getCategoryById(categoryId) {
  return categories.find(c => c.id === parseInt(categoryId)) || null;
}

/**
 * Get products by category
 * @param {number} categoryId - Category ID
 * @returns {Array} Products in category
 */
export function getProductsByCategory(categoryId) {
  return products.filter(p => p.categoryId === parseInt(categoryId));
}
