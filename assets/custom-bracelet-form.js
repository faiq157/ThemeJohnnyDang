// Custom Bracelet Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('custom-bracelet-form');
  const fileInput = document.getElementById('sample-product-image');
  const fileName = document.querySelector('.custom-bracelet-form__file-name');
  const submitButton = document.querySelector('.custom-bracelet-form__submit');
  const selects = document.querySelectorAll('.custom-bracelet-form__select');
  const checkboxes = document.querySelectorAll('.custom-bracelet-form__checkbox');

  // File upload functionality
  if (fileInput && fileName) {
    fileInput.addEventListener('change', function(event) {
      const files = event.target.files;
      let displayName = 'No file chosen';
      
      if (files.length > 0) {
        if (files.length === 1) {
          displayName = files[0].name;
        } else {
          displayName = `${files.length} files selected`;
        }
      }
      
      fileName.textContent = displayName;
      
      // Validate file size and type
      validateFileUpload(files);
    });
  }

  // Form validation
  function validateForm() {
    let isValid = true;
    const errors = [];

    // Check required selects
    selects.forEach(select => {
      if (select.hasAttribute('required') && !select.value) {
        isValid = false;
        errors.push(`${select.previousElementSibling.textContent} is required`);
        select.style.borderColor = '#ff4444';
      } else {
        select.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    });

    // Check required checkboxes
    checkboxes.forEach(checkbox => {
      if (checkbox.hasAttribute('required') && !checkbox.checked) {
        isValid = false;
        errors.push('You must accept the Terms of Service');
        checkbox.style.accentColor = '#ff4444';
      } else {
        checkbox.style.accentColor = '#ffd700';
      }
    });

    // Show errors if any
    if (!isValid) {
      showNotification('Please fill in all required fields', 'error');
    }

    return isValid;
  }

  // File validation
  function validateFileUpload(files) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        showNotification(`File "${file.name}" is too large. Maximum size is 10MB.`, 'error');
        fileInput.value = '';
        fileName.textContent = 'No file chosen';
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        showNotification(`File "${file.name}" is not a supported format. Please use JPG, PNG, or PDF.`, 'error');
        fileInput.value = '';
        fileName.textContent = 'No file chosen';
        return;
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      // Show loading state
      submitButton.classList.add('loading');
      submitButton.disabled = true;

      // Prepare form data
      const formData = new FormData(form);
      
      // Add additional properties
      formData.append('properties[Form Type]', 'Custom Bracelet Order');
      formData.append('properties[Submission Date]', new Date().toISOString());
      
      // Submit to cart
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 422) {
          throw new Error(data.description || 'Failed to add to cart');
        }
        
        showNotification('Order submitted successfully! You will be contacted within 3-5 days.', 'success');
        
        // Redirect to cart or show success page
        setTimeout(() => {
          window.location.href = '/cart';
        }, 2000);
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification('There was an error submitting your order. Please try again.', 'error');
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
      });
    });
  }

  // Notification system
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.custom-bracelet-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `custom-bracelet-notification custom-bracelet-notification--${type}`;
    notification.innerHTML = `
      <div class="custom-bracelet-notification__content">
        <span class="custom-bracelet-notification__message">${message}</span>
        <button class="custom-bracelet-notification__close" onclick="this.parentElement.parentElement.remove()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      animation: slideInRight 0.3s ease;
      ${type === 'success' ? 'background: rgba(34, 197, 94, 0.9); color: white;' : ''}
      ${type === 'error' ? 'background: rgba(239, 68, 68, 0.9); color: white;' : ''}
      ${type === 'info' ? 'background: rgba(59, 130, 246, 0.9); color: white;' : ''}
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .custom-bracelet-notification__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    
    .custom-bracelet-notification__message {
      flex: 1;
      font-weight: 500;
    }
    
    .custom-bracelet-notification__close {
      background: none;
      border: none;
      color: currentColor;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }
    
    .custom-bracelet-notification__close:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `;
  document.head.appendChild(style);

  // Real-time form validation
  selects.forEach(select => {
    select.addEventListener('change', function() {
      if (this.hasAttribute('required') && this.value) {
        this.style.borderColor = 'rgba(255, 215, 0, 0.5)';
      } else if (this.hasAttribute('required') && !this.value) {
        this.style.borderColor = '#ff4444';
      } else {
        this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    });
  });

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.hasAttribute('required') && this.checked) {
        this.style.accentColor = '#ffd700';
      } else if (this.hasAttribute('required') && !this.checked) {
        this.style.accentColor = '#ff4444';
      } else {
        this.style.accentColor = '#ffd700';
      }
    });
  });

  // Smooth scrolling for form interactions
  const formFields = document.querySelectorAll('.custom-bracelet-form__field');
  formFields.forEach(field => {
    const input = field.querySelector('input, select');
    if (input) {
      input.addEventListener('focus', function() {
        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  });

  // Add loading state to file upload
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      const fileButton = document.querySelector('.custom-bracelet-form__file-button');
      if (fileButton && this.files.length > 0) {
        fileButton.style.background = 'linear-gradient(45deg, #34d399, #10b981)';
        fileButton.textContent = 'File Selected ✓';
        
        setTimeout(() => {
          fileButton.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
          fileButton.textContent = 'Choose file';
        }, 2000);
      }
    });
  }

  // Form analytics (optional)
  function trackFormInteraction(action, field) {
    // Add your analytics tracking here
    console.log(`Form interaction: ${action} on ${field}`);
  }

  // Track form field interactions
  document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('focus', () => trackFormInteraction('focus', field.name || field.id));
    field.addEventListener('blur', () => trackFormInteraction('blur', field.name || field.id));
    field.addEventListener('change', () => trackFormInteraction('change', field.name || field.id));
  });
});