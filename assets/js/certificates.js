// ===== GLOBAL VARIABLES FOR CERTIFICATES PAGE =====
let currentTheme = localStorage.getItem("theme") || "dark";

// ===== DOM ELEMENTS =====
const themeToggle = document.getElementById("theme-toggle");
const backToTop = document.getElementById("back-to-top");
const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function() {
    initializeCertificatesPage();
});

function initializeCertificatesPage() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        offset: 100
    });
    
    // Initialize all components
    initializeLoading();
    initializeNavigation();
    initializeTheme();
    initializeScrollEffects();
    initializeFilters();
    initializeAnimations();
    initializeCursor();
    initializeParticles();
    
    // Set initial theme
    setTheme(currentTheme);
}

// ===== LOADING SCREEN =====
function initializeLoading() {
    const loadingScreen = document.getElementById("loading-screen");
    window.addEventListener("load", function() {
        setTimeout(() => {
            loadingScreen.classList.add("hidden");
        }, 500);
    });
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = document.getElementById("navbar");
    const mobileToggle = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");

    // Mobile menu toggle
    mobileToggle.addEventListener("click", function() {
        navMenu.classList.toggle("active");
        mobileToggle.classList.toggle("active");
    });

    // Navbar background on scroll
    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(10, 10, 10, 0.95)";
        } else {
            navbar.style.background = "rgba(10, 10, 10, 0.9)";
        }
    });
}

// ===== THEME TOGGLE =====
function initializeTheme() {
    themeToggle.addEventListener("click", toggleTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(currentTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
    
    const themeIcon = themeToggle.querySelector(".theme-icon");
    themeIcon.className = theme === "dark" ? "bx bx-sun theme-icon" : "bx bx-moon theme-icon";
    
    localStorage.setItem("theme", theme);
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Back to top button
    backToTop.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", function() {
        if (window.scrollY > 300) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });
}

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
    const certificateFilters = document.querySelectorAll(".certificates-filter .filter-btn");
    const certificateCards = document.querySelectorAll(".certificate-card");
    
    certificateFilters.forEach(filter => {
        filter.addEventListener("click", function() {
            const filterValue = this.getAttribute("data-filter");
            
            // Update active filter
            certificateFilters.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            
            // Filter certificates
            filterItems(certificateCards, filterValue);
        });
    });
}

function filterItems(items, filterValue) {
    items.forEach(item => {
        const categories = item.getAttribute("data-category");
        
        if (filterValue === "all" || categories.includes(filterValue)) {
            item.style.display = "block";
            setTimeout(() => {
                item.classList.add("visible");
                item.classList.remove("hidden");
            }, 10);
        } else {
            item.classList.add("hidden");
            item.classList.remove("visible");
            setTimeout(() => {
                item.style.display = "none";
            }, 300);
        }
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Hover animations for cards
    const cards = document.querySelectorAll(".certificate-card");
    
    cards.forEach(card => {
        card.addEventListener("mouseenter", function() {
            gsap.to(this, {
                duration: 0.3,
                y: -10,
                scale: 1.02,
                ease: "power2.out"
            });
        });
        
        card.addEventListener("mouseleave", function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
    
    // Button hover animations
    const buttons = document.querySelectorAll(".btn");
    
    buttons.forEach(button => {
        button.addEventListener("mouseenter", function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.05,
                ease: "power2.out"
            });
        });
        
        button.addEventListener("mouseleave", function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
}

// ===== CUSTOM CURSOR =====
function initializeCursor() {
    if (window.innerWidth > 768) {
        document.addEventListener("mousemove", function(e) {
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
        const interactiveElements = document.querySelectorAll("a, button, .certificate-card");
        
        interactiveElements.forEach(element => {
            element.addEventListener("mouseenter", function() {
                gsap.to(cursor, {
                    duration: 0.2,
                    scale: 1.5
                });
                gsap.to(cursorFollower, {
                    duration: 0.2,
                    scale: 1.5
                });
            });
            
            element.addEventListener("mouseleave", function() {
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
    const particlesContainer = document.createElement("div");
    particlesContainer.id = "particles";
    particlesContainer.className = "particles";
    document.body.prepend(particlesContainer);

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement("div");
    particle.className = "particle";
    
    // Random position
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = (Math.random() * 4 + 4) + "s";
    
    container.appendChild(particle);
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
window.addEventListener("error", function(e) {
    console.error("JavaScript Error:", e.error);
});

window.addEventListener("unhandledrejection", function(e) {
    console.error("Unhandled Promise Rejection:", e.reason);
});

// Inject notification styles (if needed, copy from main.js or ensure style.css covers it)
// For now, assuming style.css covers notification styles



