/**
 * Fresh & Clean Laundry - Interactive JavaScript Features
 * 
 * Implements progressive enhancement with vanilla JavaScript:
 * - Smooth scrolling navigation
 * - Mobile hamburger menu
 * - Lazy loading images
 * - Scroll-to-top button
 * - Form validation
 * - Keyboard accessibility
 * 
 * @generated-from: task-id:TASK-003
 * @modifies: index.html
 * @dependencies: []
 */

(function() {
  'use strict';

  // ============================================
  // Configuration & Constants
  // ============================================
  const CONFIG = Object.freeze({
    SCROLL_OFFSET: 80,
    SCROLL_TO_TOP_THRESHOLD: 300,
    MOBILE_BREAKPOINT: 768,
    LAZY_LOAD_ROOT_MARGIN: '50px',
    DEBOUNCE_DELAY: 150,
    ANIMATION_DURATION: 300,
  });

  const SELECTORS = Object.freeze({
    NAV_LINKS: 'header nav a[href^="#"]',
    MOBILE_MENU_TOGGLE: '.mobile-menu-toggle',
    MOBILE_MENU: 'header nav',
    LAZY_IMAGES: 'img[loading="lazy"]',
    SCROLL_TO_TOP: '.scroll-to-top',
    CONTACT_FORM: '#contact-form',
    SKIP_LINK: '.skip-link',
  });

  const CLASSES = Object.freeze({
    MOBILE_MENU_OPEN: 'mobile-menu-open',
    SCROLL_TO_TOP_VISIBLE: 'visible',
    LAZY_LOADED: 'lazy-loaded',
    FORM_ERROR: 'error',
    FORM_SUCCESS: 'success',
  });

  // ============================================
  // Utility Functions
  // ============================================

  /**
   * Debounce function to limit execution rate
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    let timeoutId = null;
    
    return function debounced(...args) {
      const context = this;
      
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        timeoutId = null;
        func.apply(context, args);
      }, wait);
    };
  }

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} True if element is in viewport
   */
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Get scroll offset for navigation
   * @returns {number} Scroll offset in pixels
   */
  function getScrollOffset() {
    const header = document.querySelector('header');
    return header ? header.offsetHeight : CONFIG.SCROLL_OFFSET;
  }

  /**
   * Log error with context
   * @param {string} context - Error context
   * @param {Error} error - Error object
   */
  function logError(context, error) {
    console.error(`[Fresh & Clean Laundry] ${context}:`, error);
  }

  // ============================================
  // Smooth Scrolling Navigation
  // ============================================

  /**
   * Initialize smooth scrolling for navigation links
   */
  function initSmoothScrolling() {
    try {
      const navLinks = document.querySelectorAll(SELECTORS.NAV_LINKS);
      
      navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
      });
    } catch (error) {
      logError('Smooth scrolling initialization', error);
    }
  }

  /**
   * Handle smooth scroll click event
   * @param {Event} event - Click event
   */
  function handleSmoothScroll(event) {
    try {
      const targetId = this.getAttribute('href');
      
      if (!targetId || !targetId.startsWith('#')) {
        return;
      }

      const targetElement = document.querySelector(targetId);
      
      if (!targetElement) {
        return;
      }

      event.preventDefault();

      const offset = getScrollOffset();
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without triggering scroll
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }

      // Close mobile menu if open
      closeMobileMenu();

      // Set focus to target for accessibility
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus();
      targetElement.removeAttribute('tabindex');
    } catch (error) {
      logError('Smooth scroll handler', error);
    }
  }

  // ============================================
  // Mobile Hamburger Menu
  // ============================================

  /**
   * Initialize mobile hamburger menu
   */
  function initMobileMenu() {
    try {
      // Create hamburger button if it doesn't exist
      const header = document.querySelector('header');
      const nav = document.querySelector('header nav');
      
      if (!header || !nav) {
        return;
      }

      let menuToggle = document.querySelector(SELECTORS.MOBILE_MENU_TOGGLE);
      
      if (!menuToggle) {
        menuToggle = createMobileMenuToggle();
        header.querySelector('.header-container').insertBefore(menuToggle, nav);
      }

      menuToggle.addEventListener('click', toggleMobileMenu);

      // Close menu when clicking outside
      document.addEventListener('click', handleOutsideClick);

      // Close menu on escape key
      document.addEventListener('keydown', handleEscapeKey);

      // Handle window resize
      window.addEventListener('resize', debounce(handleResize, CONFIG.DEBOUNCE_DELAY));
    } catch (error) {
      logError('Mobile menu initialization', error);
    }
  }

  /**
   * Create mobile menu toggle button
   * @returns {HTMLElement} Menu toggle button
   */
  function createMobileMenuToggle() {
    const button = document.createElement('button');
    button.className = 'mobile-menu-toggle';
    button.setAttribute('aria-label', 'Toggle navigation menu');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = `
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    `;
    
    // Add styles
    addMobileMenuStyles();
    
    return button;
  }

  /**
   * Add mobile menu styles dynamically
   */
  function addMobileMenuStyles() {
    if (document.getElementById('mobile-menu-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'mobile-menu-styles';
    style.textContent = `
      .mobile-menu-toggle {
        display: none;
        flex-direction: column;
        justify-content: space-around;
        width: 2rem;
        height: 2rem;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 10;
      }

      .mobile-menu-toggle:focus {
        outline: 2px solid var(--color-primary-600, #1e40af);
        outline-offset: 2px;
        border-radius: 0.25rem;
      }

      .hamburger-line {
        width: 2rem;
        height: 0.25rem;
        background-color: var(--color-primary-600, #1e40af);
        border-radius: 0.25rem;
        transition: all 0.3s ease-in-out;
        transform-origin: center;
      }

      @media (max-width: 767px) {
        .mobile-menu-toggle {
          display: flex;
        }

        header nav {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: var(--color-white, #ffffff);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out;
        }

        header nav.mobile-menu-open {
          max-height: 500px;
        }

        header nav ul {
          flex-direction: column;
          padding: 1rem;
        }

        .mobile-menu-open .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translate(0.5rem, 0.5rem);
        }

        .mobile-menu-open .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-open .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(0.5rem, -0.5rem);
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    try {
      const nav = document.querySelector('header nav');
      const menuToggle = document.querySelector(SELECTORS.MOBILE_MENU_TOGGLE);
      
      if (!nav || !menuToggle) {
        return;
      }

      const isOpen = nav.classList.contains(CLASSES.MOBILE_MENU_OPEN);
      
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    } catch (error) {
      logError('Mobile menu toggle', error);
    }
  }

  /**
   * Open mobile menu
   */
  function openMobileMenu() {
    const nav = document.querySelector('header nav');
    const menuToggle = document.querySelector(SELECTORS.MOBILE_MENU_TOGGLE);
    
    if (!nav || !menuToggle) {
      return;
    }

    nav.classList.add(CLASSES.MOBILE_MENU_OPEN);
    menuToggle.classList.add(CLASSES.MOBILE_MENU_OPEN);
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    const nav = document.querySelector('header nav');
    const menuToggle = document.querySelector(SELECTORS.MOBILE_MENU_TOGGLE);
    
    if (!nav || !menuToggle) {
      return;
    }

    nav.classList.remove(CLASSES.MOBILE_MENU_OPEN);
    menuToggle.classList.remove(CLASSES.MOBILE_MENU_OPEN);
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  /**
   * Handle click outside menu
   * @param {Event} event - Click event
   */
  function handleOutsideClick(event) {
    const nav = document.querySelector('header nav');
    const menuToggle = document.querySelector(SELECTORS.MOBILE_MENU_TOGGLE);
    
    if (!nav || !menuToggle) {
      return;
    }

    if (!nav.classList.contains(CLASSES.MOBILE_MENU_OPEN)) {
      return;
    }

    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMobileMenu();
    }
  }

  /**
   * Handle escape key press
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleEscapeKey(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      closeMobileMenu();
    }
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    if (window.innerWidth >= CONFIG.MOBILE_BREAKPOINT) {
      closeMobileMenu();
    }
  }

  // ============================================
  // Lazy Loading Images
  // ============================================

  /**
   * Initialize lazy loading for images
   */
  function initLazyLoading() {
    try {
      const images = document.querySelectorAll(SELECTORS.LAZY_IMAGES);
      
      if (!images.length) {
        return;
      }

      // Use Intersection Observer if available
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(
          handleImageIntersection,
          {
            rootMargin: CONFIG.LAZY_LOAD_ROOT_MARGIN,
            threshold: 0.01
          }
        );

        images.forEach(image => {
          imageObserver.observe(image);
        });
      } else {
        // Fallback for browsers without Intersection Observer
        images.forEach(loadImage);
      }
    } catch (error) {
      logError('Lazy loading initialization', error);
    }
  }

  /**
   * Handle image intersection
   * @param {IntersectionObserverEntry[]} entries - Intersection entries
   * @param {IntersectionObserver} observer - Intersection observer
   */
  function handleImageIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        loadImage(image);
        observer.unobserve(image);
      }
    });
  }

  /**
   * Load image
   * @param {HTMLImageElement} image - Image element
   */
  function loadImage(image) {
    try {
      if (image.classList.contains(CLASSES.LAZY_LOADED)) {
        return;
      }

      const src = image.getAttribute('src');
      
      if (!src) {
        return;
      }

      image.addEventListener('load', () => {
        image.classList.add(CLASSES.LAZY_LOADED);
      });

      image.addEventListener('error', () => {
        logError('Image loading', new Error(`Failed to load image: ${src}`));
      });

      // Image already has src, just mark as loaded
      if (image.complete) {
        image.classList.add(CLASSES.LAZY_LOADED);
      }
    } catch (error) {
      logError('Image loading', error);
    }
  }

  // ============================================
  // Scroll to Top Button
  // ============================================

  /**
   * Initialize scroll to top button
   */
  function initScrollToTop() {
    try {
      let scrollButton = document.querySelector(SELECTORS.SCROLL_TO_TOP);
      
      if (!scrollButton) {
        scrollButton = createScrollToTopButton();
        document.body.appendChild(scrollButton);
      }

      scrollButton.addEventListener('click', scrollToTop);
      window.addEventListener('scroll', debounce(handleScroll, CONFIG.DEBOUNCE_DELAY));
      
      // Initial check
      handleScroll();
    } catch (error) {
      logError('Scroll to top initialization', error);
    }
  }

  /**
   * Create scroll to top button
   * @returns {HTMLElement} Scroll to top button
   */
  function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Scroll to top');
    button.innerHTML = '↑';
    
    // Add styles
    addScrollToTopStyles();
    
    return button;
  }

  /**
   * Add scroll to top button styles
   */
  function addScrollToTopStyles() {
    if (document.getElementById('scroll-to-top-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'scroll-to-top-styles';
    style.textContent = `
      .scroll-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        background-color: var(--color-primary-600, #1e40af);
        color: var(--color-white, #ffffff);
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 100;
      }

      .scroll-to-top:hover {
        background-color: var(--color-primary-700, #1e3a8a);
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }

      .scroll-to-top:focus {
        outline: 2px solid var(--color-primary-600, #1e40af);
        outline-offset: 2px;
      }

      .scroll-to-top:active {
        transform: translateY(0);
      }

      .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
      }

      @media (max-width: 767px) {
        .scroll-to-top {
          bottom: 1rem;
          right: 1rem;
          width: 2.5rem;
          height: 2.5rem;
          font-size: 1.25rem;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Handle scroll event
   */
  function handleScroll() {
    try {
      const scrollButton = document.querySelector(SELECTORS.SCROLL_TO_TOP);
      
      if (!scrollButton) {
        return;
      }

      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollPosition > CONFIG.SCROLL_TO_TOP_THRESHOLD) {
        scrollButton.classList.add(CLASSES.SCROLL_TO_TOP_VISIBLE);
      } else {
        scrollButton.classList.remove(CLASSES.SCROLL_TO_TOP_VISIBLE);
      }
    } catch (error) {
      logError('Scroll handler', error);
    }
  }

  /**
   * Scroll to top of page
   */
  function scrollToTop() {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      logError('Scroll to top', error);
    }
  }

  // ============================================
  // Contact Form Validation (Placeholder)
  // ============================================

  /**
   * Initialize contact form validation
   * Note: Form doesn't exist in HTML yet, but functionality is ready
   */
  function initFormValidation() {
    try {
      const form = document.querySelector(SELECTORS.CONTACT_FORM);
      
      if (!form) {
        // Form not present in current HTML, skip initialization
        return;
      }

      form.addEventListener('submit', handleFormSubmit);
      
      // Add real-time validation
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
      });
    } catch (error) {
      logError('Form validation initialization', error);
    }
  }

  /**
   * Handle form submit
   * @param {Event} event - Submit event
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
      const form = event.target;
      const isValid = validateForm(form);
      
      if (!isValid) {
        return;
      }

      // Form is valid, would submit here
      console.log('Form is valid and ready to submit');
      
      // Show success message
      showFormSuccess(form);
    } catch (error) {
      logError('Form submit handler', error);
    }
  }

  /**
   * Validate entire form
   * @param {HTMLFormElement} form - Form element
   * @returns {boolean} True if form is valid
   */
  function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      if (!validateField({ target: input })) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  /**
   * Validate individual field
   * @param {Event} event - Blur event
   * @returns {boolean} True if field is valid
   */
  function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    clearFieldError(event);
    
    // Required field validation
    if (required && !value) {
      showFieldError(field, 'This field is required');
      return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
      }
    }
    
    return true;
  }

  /**
   * Show field error
   * @param {HTMLElement} field - Form field
   * @param {string} message - Error message
   */
  function showFieldError(field, message) {
    field.classList.add(CLASSES.FORM_ERROR);
    field.setAttribute('aria-invalid', 'true');
    
    let errorElement = field.parentElement.querySelector('.field-error');
    
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'field-error';
      errorElement.setAttribute('role', 'alert');
      field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }

  /**
   * Clear field error
   * @param {Event} event - Input event
   */
  function clearFieldError(event) {
    const field = event.target;
    field.classList.remove(CLASSES.FORM_ERROR);
    field.removeAttribute('aria-invalid');
    
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Show form success message
   * @param {HTMLFormElement} form - Form element
   */
  function showFormSuccess(form) {
    form.classList.add(CLASSES.FORM_SUCCESS);
    
    let successElement = form.querySelector('.form-success');
    
    if (!successElement) {
      successElement = document.createElement('div');
      successElement.className = 'form-success';
      successElement.setAttribute('role', 'status');
      successElement.textContent = 'Thank you! Your message has been sent successfully.';
      form.insertBefore(successElement, form.firstChild);
    }
    
    // Reset form after short delay
    setTimeout(() => {
      form.reset();
      form.classList.remove(CLASSES.FORM_SUCCESS);
      if (successElement) {
        successElement.remove();
      }
    }, 5000);
  }

  // ============================================
  // Keyboard Accessibility Enhancements
  // ============================================

  /**
   * Initialize keyboard accessibility
   */
  function initKeyboardAccessibility() {
    try {
      // Ensure skip link works
      const skipLink = document.querySelector(SELECTORS.SKIP_LINK);
      if (skipLink) {
        skipLink.addEventListener('click', handleSkipLink);
      }

      // Add keyboard navigation for cards
      const cards = document.querySelectorAll('.service-card, .contact-item');
      cards.forEach(card => {
        if (!card.hasAttribute('tabindex')) {
          card.setAttribute('tabindex', '0');
        }
      });
    } catch (error) {
      logError('Keyboard accessibility initialization', error);
    }
  }

  /**
   * Handle skip link click
   * @param {Event} event - Click event
   */
  function handleSkipLink(event) {
    event.preventDefault();
    const main = document.querySelector('#main');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      main.removeAttribute('tabindex');
    }
  }

  // ============================================
  // Initialization
  // ============================================

  /**
   * Initialize all features
   */
  function init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFeatures);
      } else {
        initializeFeatures();
      }
    } catch (error) {
      logError('Initialization', error);
    }
  }

  /**
   * Initialize all features after DOM is ready
   */
  function initializeFeatures() {
    try {
      initSmoothScrolling();
      initMobileMenu();
      initLazyLoading();
      initScrollToTop();
      initFormValidation();
      initKeyboardAccessibility();
      
      console.log('[Fresh & Clean Laundry] Interactive features initialized successfully');
    } catch (error) {
      logError('Feature initialization', error);
    }
  }

  // Start initialization
  init();

})();