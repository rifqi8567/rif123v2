// ===== GLOBAL VARIABLES =====
let isLoading = true;
let currentTheme = 'dark';
let typewriterIndex = 0;
let typewriterText = '';
const typewriterTexts = [
    'Full Stack Developer',
    'Laravel Expert',
    'Flutter Developer',
    'API Specialist',
    'Problem Solver'
];

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const typewriterElement = document.getElementById('typewriter');
const contactForm = document.getElementById('contact-form');
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Initialize all components
    initializeLoading();
    initializeNavigation();
    initializeTheme();
    initializeTypewriter();
    initializeScrollEffects();
    initializeFilters();
    initializeAnimations();
    initializeCursor();
    initializeParticles();
    initializeCounters();
    initializeSkillBars();
    initializeContactForm();
    
    // Set initial theme
    setTheme(localStorage.getItem('theme') || 'dark');
}

// ===== LOADING SCREEN =====
function initializeLoading() {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressMessage = document.querySelector('.progress-message');
    
    let progress = 0;
    const messages = [
        'Initializing...',
        'Loading assets...',
        'Setting up interface...',
        'Almost ready...',
        'Welcome!'
    ];
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        progressPercentage.textContent = Math.floor(progress) + '%';
        
        // Update message based on progress
        if (progress < 20) {
            progressMessage.textContent = messages[0];
        } else if (progress < 40) {
            progressMessage.textContent = messages[1];
        } else if (progress < 60) {
            progressMessage.textContent = messages[2];
        } else if (progress < 90) {
            progressMessage.textContent = messages[3];
        } else {
            progressMessage.textContent = messages[4];
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                isLoading = false;
                
                // Start animations after loading
                setTimeout(() => {
                    startHeroAnimations();
                }, 500);
            }, 1000);
        }
    }, 100);
}

function startHeroAnimations() {
    // Animate hero elements
    gsap.from('.hero-greeting', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-title .title-line', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3
    });
    
    gsap.from('.hero-description', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.8
    });
    
    gsap.from('.hero-buttons .btn', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 1.2
    });
    
    gsap.from('.hero-social .social-link', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 1.5
    });
}

// ===== NAVIGATION =====
function initializeNavigation() {
    // Mobile menu toggle
    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetHref = this.getAttribute("href");

            // External links (.html)
            if (targetHref.endsWith(".html")) {
                e.preventDefault();
                if (typeof window.CertificateTransition !== 'undefined' && targetHref.includes('certificates.html')) {
                    const certTransition = new window.CertificateTransition();
                    certTransition.showTransition(() => {
                        window.location.href = targetHref;
                    });
                } else {
                    window.location.href = targetHref;
                }
                return;
            }

            // Internal links (#id)
            if (targetHref.startsWith("#")) {
                e.preventDefault();
                const targetSection = document.querySelector(targetHref);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth"
                    });

                    // Update active link
                    updateActiveNavLink(this);
                }
            }

            // Close mobile menu if open
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // Scroll spy
    window.addEventListener('scroll', handleNavbarScroll);
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
}

function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function handleNavbarScroll() {
    const scrollY = window.scrollY;
    
    // Navbar background on scroll
    if (scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
    
    // Update active section
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    });
    
    // Back to top button
    if (scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

// ===== THEME TOGGLE =====
function initializeTheme() {
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(currentTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.className = theme === 'dark' ? 'bx bx-sun theme-icon' : 'bx bx-moon theme-icon';
    
    localStorage.setItem('theme', theme);
}

// ===== TYPEWRITER EFFECT =====
function initializeTypewriter() {
    if (typewriterElement) {
        startTypewriter();
    }
}

function startTypewriter() {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = typewriterTexts[textIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typewriterTexts.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Back to top button
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.geometric-shapes .shape');
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
    // Project filters
    const projectFilters = document.querySelectorAll('.projects-filter .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    projectFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter
            projectFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            filterItems(projectCards, filterValue);
        });
    });
    

}

function filterItems(items, filterValue) {
    items.forEach(item => {
        const categories = item.getAttribute('data-category');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => {
                item.classList.add('visible');
                item.classList.remove('hidden');
            }, 10);
        } else {
            item.classList.add('hidden');
            item.classList.remove('visible');
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Hover animations for cards
    const cards = document.querySelectorAll('.project-card, .certificate-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -10,
                scale: 1.02,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                scale: 1,
                ease: 'power2.out'
            });
        });
    });
    
    // Button hover animations
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.05,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
        });
    });
    
    // Social link animations
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                rotation: 360,
                scale: 1.1,
                ease: 'power2.out'
            });
        });
        
        link.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                rotation: 0,
                scale: 1,
                ease: 'power2.out'
            });
        });
    });
}

// ===== CUSTOM CURSOR =====
function initializeCursor() {
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', function(e) {
            gsap.to(cursor, {
                duration: 0.1,
                x: e.clientX - 10,
                y: e.clientY - 10
            });
            
            gsap.to(cursorFollower, {
                duration: 0.3,
                x: e.clientX - 20,
                y: e.clientY - 20
            });
        });
        
        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .certificate-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                gsap.to(cursor, {
                    duration: 0.2,
                    scale: 1.5
                });
                gsap.to(cursorFollower, {
                    duration: 0.2,
                    scale: 1.5
                });
            });
            
            element.addEventListener('mouseleave', function() {
                gsap.to(cursor, {
                    duration: 0.2,
                    scale: 1
                });
                gsap.to(cursorFollower, {
                    duration: 0.2,
                    scale: 1
                });
            });
        });
    }
}

// ===== PARTICLES =====
function initializeParticles() {
    const particleContainers = [
        'particles',
        'particles-about',
        'particles-skills',
        'particles-projects',
        'particles-certificates',
        'particles-experience',
        'particles-contact'
    ];
    
    particleContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            const particleCount = 50;
            for (let i = 0; i < particleCount; i++) {
                createParticle(container);
            }
        }
    });
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    
    container.appendChild(particle);
}

// ===== COUNTERS =====
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ===== SKILL BARS =====
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress[data-width]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBar(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

function animateSkillBar(element) {
    const width = element.getAttribute('data-width');
    
    gsap.to(element, {
        duration: 1.5,
        width: width + '%',
        ease: 'power2.out',
        delay: 0.2
    });
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Form input animations
        const formInputs = document.querySelectorAll('.form-input, .form-textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                gsap.to(this.nextElementSibling, {
                    duration: 0.3,
                    width: '100%'
                });
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    gsap.to(this.nextElementSibling, {
                        duration: 0.3,
                        width: '0%'
                    });
                }
            });
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('.form-submit');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<span>Sending...</span><i class="bx bx-loader-alt bx-spin"></i>';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.innerHTML = '<span>Message Sent!</span><i class="bx bx-check"></i>';
        
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            contactForm.reset();
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
        }, 2000);
    }, 2000);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    gsap.from(notification, {
        duration: 0.3,
        y: -100,
        opacity: 0,
        ease: 'power2.out'
    });
    
    // Auto remove
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    gsap.to(notification, {
        duration: 0.3,
        y: -100,
        opacity: 0,
        ease: 'power2.in',
        onComplete: () => {
            notification.remove();
        }
    });
}

// ===== VIEW ALL CERTIFICATES =====
document.getElementById('view-all-certificates')?.addEventListener('click', function() {
    // Show all certificates
    const hiddenCertificates = document.querySelectorAll('.certificate-card[style*="display: none"]');
    
    hiddenCertificates.forEach(cert => {
        cert.style.display = 'block';
        setTimeout(() => {
            cert.classList.add('visible');
            cert.classList.remove('hidden');
        }, 10);
    });
    
    // Hide the button
    this.style.display = 'none';
    
    showNotification('All certificates are now visible!', 'info');
});

// ===== SCROLL REVEAL =====
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleNavbarScroll, 10);
    });
}

// ===== EASTER EGGS =====
function initializeEasterEggs() {
    // Konami code
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    // Create rainbow effect
    document.body.style.animation = 'rainbow 2s infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
        showNotification('🎉 You found the easter egg! 🎉', 'success');
    }, 4000);
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ===== ADDITIONAL CSS FOR NOTIFICATIONS =====
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 1rem;
        z-index: 10000;
        min-width: 300px;
        box-shadow: var(--shadow-lg);
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-info {
        border-left: 4px solid var(--accent-primary);
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--text-primary);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        margin-left: 1rem;
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize easter eggs
initializeEasterEggs();

// Initialize scroll reveal
initializeScrollReveal();

// Optimize performance
optimizePerformance();


// ===== MOBILE TOUCH EVENTS FOR TECH ITEMS =====
function initializeMobileTechInteraction() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        // Touch start event
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.classList.add('touch-active');
        }, { passive: false });
        
        // Touch end event
        item.addEventListener('touchend', function(e) {
            e.preventDefault();
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 300);
        }, { passive: false });
        
        // Touch cancel event
        item.addEventListener('touchcancel', function(e) {
            this.classList.remove('touch-active');
        });
        
        // Click event for mobile
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.add('touch-active');
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 300);
            }
        });
    });
}

// Add CSS for touch active state
const mobileTechStyles = `
    .tech-item.touch-active {
        transform: translateY(-5px) rotate(3deg) scale(1.02) !important;
        border-color: var(--accent-primary) !important;
        box-shadow: 0 8px 20px rgba(0, 212, 255, 0.15) !important;
    }
    
    .tech-item.touch-active .tech-icon {
        transform: rotate(-3deg) scale(1.05) !important;
    }
    
    .tech-item.touch-active .tech-icon img,
    .tech-item.touch-active .tech-icon i {
        transform: rotate(180deg) scale(1.1) !important;
        transition: transform 0.4s ease !important;
    }
    
    /* Force animations on mobile */
    @media (max-width: 768px) {
        .tech-item {
            transition: all 0.3s ease !important;
        }
        
        .tech-icon {
            transition: all 0.3s ease !important;
        }
        
        .tech-icon img,
        .tech-icon i {
            transition: all 0.4s ease !important;
        }
    }
`;

// Inject mobile tech styles
const mobileStyleSheet = document.createElement('style');
mobileStyleSheet.textContent = mobileTechStyles;
document.head.appendChild(mobileStyleSheet);

// Initialize mobile tech interaction when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileTechInteraction();
});

// Re-initialize on window resize
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        initializeMobileTechInteraction();
    }
});

