// Global theme functionality
class ThemeUtility {
  constructor() {
    this.init();
  }

  init() {
    this.setupAccessibility();
    this.setupCartNotifications();
    this.setupProductForms();
  }

  setupAccessibility() {
    // Skip links functionality
    const skipLinks = document.querySelectorAll('.skip-to-content-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  setupCartNotifications() {
    // Basic cart notification system
    window.showCartNotification = (message, type = 'success') => {
      const notification = document.createElement('div');
      notification.className = `cart-notification cart-notification--${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        z-index: 1000;
        transition: transform 0.3s ease;
        transform: translateX(100%);
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    };
  }

  setupProductForms() {
    // Handle product form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.matches('[data-type="add-to-cart-form"]')) {
        e.preventDefault();
        this.handleAddToCart(e.target);
      }
    });
  }

  async handleAddToCart(form) {
    try {
      const formData = new FormData(form);
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        window.showCartNotification('Product added to cart!');
        PubSub.publish('cart:item-added', data);
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      window.showCartNotification('Failed to add product to cart', 'error');
    }
  }

  // Utility functions
  static formatMoney(cents, format = '${{amount}}') {
    if (typeof cents !== 'number') return cents;
    const value = (cents / 100).toFixed(2);
    return format.replace('{{amount}}', value);
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize theme utilities when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ThemeUtility());
} else {
  new ThemeUtility();
}

// Export for use in other scripts
window.ThemeUtility = ThemeUtility;
