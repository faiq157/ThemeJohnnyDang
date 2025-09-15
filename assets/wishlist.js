class WishlistManager {
  constructor() {
    this.wishlistKey = 'jd_wishlist';
    this.wishlist = this.loadWishlist();
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateWishlistUI();
  }

  loadWishlist() {
    try {
      const stored = localStorage.getItem(this.wishlistKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading wishlist:', error);
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.wishlistKey, JSON.stringify(this.wishlist));
      this.updateWishlistUI();
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }

  addToWishlist(productId, productData = {}) {
    if (!this.isInWishlist(productId)) {
      this.wishlist.push({
        id: productId,
        addedAt: new Date().toISOString(),
        ...productData
      });
      this.saveWishlist();
      this.showNotification('Added to wishlist', 'success');
      return true;
    }
    return false;
  }

  removeFromWishlist(productId) {
    const index = this.wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.saveWishlist();
      this.showNotification('Removed from wishlist', 'info');
      return true;
    }
    return false;
  }

  toggleWishlist(productId, productData = {}) {
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
      return false;
    } else {
      this.addToWishlist(productId, productData);
      return true;
    }
  }

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  }

  getWishlistCount() {
    return this.wishlist.length;
  }

  getWishlist() {
    return this.wishlist;
  }

  clearWishlist() {
    this.wishlist = [];
    this.saveWishlist();
    this.showNotification('Wishlist cleared', 'info');
  }

  bindEvents() {
    // Bind wishlist button events
    document.addEventListener('click', (e) => {
      const wishlistBtn = e.target.closest('[data-wishlist-toggle]');
      if (wishlistBtn) {
        e.preventDefault();
        
        // Check if this is the header wishlist icon
        if (wishlistBtn.id === 'wishlist-icon') {
          this.showWishlistModal();
          return;
        }
        
        // Handle product wishlist buttons
        const productId = wishlistBtn.dataset.productId;
        if (productId) {
          const productTitle = wishlistBtn.dataset.productTitle || '';
          const productImage = wishlistBtn.dataset.productImage || '';
          const productPrice = wishlistBtn.dataset.productPrice || '';
          const productUrl = wishlistBtn.dataset.productUrl || '';

          const productData = {
            title: productTitle,
            image: productImage,
            price: productPrice,
            url: productUrl
          };

          const isAdded = this.toggleWishlist(productId, productData);
          this.updateWishlistButton(wishlistBtn, isAdded);
        }
      }
    });

    // Update wishlist count in header
    this.updateWishlistCount();
  }

  updateWishlistUI() {
    // Update all wishlist buttons
    document.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
      const productId = btn.dataset.productId;
      const isInWishlist = this.isInWishlist(productId);
      this.updateWishlistButton(btn, isInWishlist);
    });

    // Update wishlist count
    this.updateWishlistCount();
  }

  updateWishlistButton(button, isInWishlist) {
    const icon = button.querySelector('.wishlist-icon');
    const text = button.querySelector('.wishlist-text');
    
    if (icon) {
      if (isInWishlist) {
        icon.classList.add('wishlist-active');
        button.classList.add('wishlist-active');
      } else {
        icon.classList.remove('wishlist-active');
        button.classList.remove('wishlist-active');
      }
    }

    if (text) {
      text.textContent = isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';
    }
  }

  updateWishlistCount() {
    const countElements = document.querySelectorAll('.wishlist-count');
    const count = this.getWishlistCount();
    
    countElements.forEach(element => {
      element.textContent = count;
      if (count > 0) {
        element.style.display = 'flex';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.border = '2px solid #000';
      } else {
        element.style.display = 'none';
      }
    });
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `wishlist-notification wishlist-notification--${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('wishlist-notification--show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
      notification.classList.remove('wishlist-notification--show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Method to get wishlist items for display
  getWishlistItems() {
    return this.wishlist.map(item => ({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price,
      url: item.url,
      addedAt: item.addedAt
    }));
  }

  // Show wishlist modal/drawer
  showWishlistModal() {
    const wishlistItems = this.getWishlistItems();
    
    if (wishlistItems.length === 0) {
      this.showNotification('Your wishlist is empty', 'info');
      return;
    }

    // Create modal HTML
    const modalHTML = `
      <div class="wishlist-modal" id="wishlist-modal">
        <div class="wishlist-modal__overlay"></div>
        <div class="wishlist-modal__content">
          <div class="wishlist-modal__header">
            <h2>Your Wishlist (${wishlistItems.length})</h2>
            <button class="wishlist-modal__close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="wishlist-modal__body">
            <div class="wishlist-items">
              ${wishlistItems.map(item => `
                <div class="wishlist-item" data-product-id="${item.id}">
                  <div class="wishlist-item__image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                  </div>
                  <div class="wishlist-item__details">
                    <h3 class="wishlist-item__title">${item.title}</h3>
                    <p class="wishlist-item__price">${item.price}</p>
                    <div class="wishlist-item__actions">
                      <a href="${item.url}" class="wishlist-item__view">View Product</a>
                      <button class="wishlist-item__remove" data-product-id="${item.id}">Remove</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="wishlist-modal__footer">
            <button class="wishlist-clear-btn" type="button">Clear Wishlist</button>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('wishlist-modal');
    setTimeout(() => {
      modal.classList.add('wishlist-modal--show');
    }, 10);

    // Bind modal events
    this.bindModalEvents(modal);
  }

  bindModalEvents(modal) {
    // Close modal
    const closeBtn = modal.querySelector('.wishlist-modal__close');
    const overlay = modal.querySelector('.wishlist-modal__overlay');
    
    const closeModal = () => {
      modal.classList.remove('wishlist-modal--show');
      setTimeout(() => {
        modal.remove();
      }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Remove item from wishlist
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('wishlist-item__remove')) {
        const productId = e.target.dataset.productId;
        this.removeFromWishlist(productId);
        
        // Remove item from modal
        const item = e.target.closest('.wishlist-item');
        item.classList.add('wishlist-item--removing');
        setTimeout(() => {
          item.remove();
          
          // Check if modal is empty
          const remainingItems = modal.querySelectorAll('.wishlist-item');
          if (remainingItems.length === 0) {
            closeModal();
          }
        }, 300);
      }
    });

    // Clear wishlist
    const clearBtn = modal.querySelector('.wishlist-clear-btn');
    clearBtn.addEventListener('click', () => {
      this.clearWishlist();
      closeModal();
    });
  }
}

// Initialize wishlist manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.wishlistManager = new WishlistManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WishlistManager;
}