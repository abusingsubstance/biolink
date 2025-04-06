/**
 * Main JavaScript File for Website
 * 
 * This file contains common website functionality including:
 * - Mobile-responsive navigation
 * - Form validation
 * - Smooth scrolling
 * - Modal/popup windows
 * - Image slider/carousel
 */

// Wait for DOM to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initSmoothScrolling();
    initModalFunctionality();
    initImageSlider();
    initFormValidation();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // If elements don't exist in the DOM, exit the function
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Toggle aria-expanded for accessibility
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !expanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-menu') && !event.target.closest('.menu-toggle')) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get the element's position relative to the viewport
                const rect = targetElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = rect.top + scrollTop;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition - 80, // Offset for fixed headers
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Modal/Popup Functionality
 */
function initModalFunctionality() {
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
    
    // Open modal when trigger is clicked
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            
            const modalId = this.getAttribute('data-modal-trigger');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
                
                // Trap focus inside modal for accessibility
                trapFocus(modal);
            }
        });
    });
    
    // Close modal when close button is clicked
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside the modal content
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
    
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }
    
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        });
        
        firstFocusableElement.focus();
    }
}

/**
 * Image Slider/Carousel
 */
function initImageSlider() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        if (!slider) return;
        
        const slides = slider.querySelectorAll('.slide');
        const prevButton = slider.querySelector('.slider-prev');
        const nextButton = slider.querySelector('.slider-next');
        const dotsContainer = slider.querySelector('.slider-dots');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        let interval;
        const autoPlayDelay = 5000; // 5 seconds
        
        // Create dots for navigation
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('slider-dot');
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }
        
        // Show the first slide
        showSlide(currentSlide);
        
        // Start autoplay
        startAutoPlay();
        
        // Navigation button event listeners
        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
        }
        
        // Pause autoplay on hover
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        
        // Functions
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
                slide.setAttribute('aria-hidden', i !== index);
            });
            
            // Update dots
            const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }
        
        function nextSlide() {
            let newIndex = currentSlide + 1;
            if (newIndex >= slides.length) {
                newIndex = 0;
            }
            showSlide(newIndex);
        }
        
        function prevSlide() {
            let newIndex = currentSlide - 1;
            if (newIndex < 0) {
                newIndex = slides.length - 1;
            }
            showSlide(newIndex);
        }
        
        function goToSlide(index) {
            showSlide(index);
        }
        
        function startAutoPlay() {
            stopAutoPlay(); // Clear any existing interval
            interval = setInterval(nextSlide, autoPlayDelay);
        }
        
        function stopAutoPlay() {
            if (interval) {
                clearInterval(interval);
            }
        }
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            const emailFields = form.querySelectorAll('input[type="email"]');
            const errorMessages = form.querySelectorAll('.error-message');
            
            // Remove existing error messages
            errorMessages.forEach(message => {
                message.remove();
            });
            
            // Validate required fields
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showError(field, 'This field is required');
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Validate email fields
            emailFields.forEach(field => {
                if (field.value.trim() && !isValidEmail(field.value)) {
                    isValid = false;
                    showError(field, 'Please enter a valid email address');
                    field.classList.add('error');
                }
            });
            
            // If the form is not valid, prevent submission
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show error message below the field
    function showError(field, message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        // Insert after the field
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
}

/**
 * Lazy Loading Images
 */
function initLazyLoading() {
    // Check if the browser supports IntersectionObserver
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    
                    // If there's a srcset
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    img.onload = () => {
                        img.removeAttribute('data-src');
                        img.removeAttribute('data-srcset');
                        img.classList.add('loaded');
                    };
                    
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        // Load all images immediately
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    }
}