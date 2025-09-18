// ===== ARTICLES PAGE CONTROLLER =====

class ArticlesController {
    constructor() {
        this.currentFilter = 'all';
        this.articlesPerPage = 6;
        this.currentPage = 1;
        this.allArticles = [];
        this.filteredArticles = [];
        
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupFilterTabs();
        this.setupSearch();
        this.setupLoadMore();
        this.setupArticleAnimations();
        this.setupNewsletterForm();
        this.initializeParticles();
        this.setupScrollEffects();
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentage = document.querySelector('.progress-percentage');
        const progressMessage = document.querySelector('.progress-message');
        
        if (!loadingScreen) return;

        let progress = 0;
        const messages = [
            'Loading Articles...',
            'Preparing Content...',
            'Almost Ready...',
            'Welcome!'
        ];

        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            progressPercentage.textContent = Math.floor(progress) + '%';
            
            const messageIndex = Math.floor((progress / 100) * messages.length);
            if (messageIndex < messages.length) {
                progressMessage.textContent = messages[messageIndex];
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        this.initializeContent();
                    }, 500);
                }, 500);
            }
        }, 100);
    }

    initializeContent() {
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }

        // Collect all articles
        this.allArticles = Array.from(document.querySelectorAll('.article-card'));
        this.filteredArticles = [...this.allArticles];
        
        // Animate stats
        this.animateStats();
        
        // Setup theme toggle
        this.setupThemeToggle();
        
        // Setup mobile menu
        this.setupMobileMenu();
    }

    setupFilterTabs() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                filterTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Get filter value
                const filter = tab.getAttribute('data-filter');
                this.filterArticles(filter);
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('article-search');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.searchArticles(searchTerm);
            });
        }
    }

    filterArticles(filter) {
        this.currentFilter = filter;
        this.currentPage = 1;
        
        const articlesGrid = document.getElementById('articles-grid');
        const articles = articlesGrid.querySelectorAll('.article-card');
        
        articles.forEach((article, index) => {
            const category = article.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                article.style.display = 'block';
                article.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
            } else {
                article.style.display = 'none';
            }
        });
        
        // Update filtered articles array
        this.filteredArticles = filter === 'all' 
            ? [...this.allArticles]
            : this.allArticles.filter(article => 
                article.getAttribute('data-category') === filter
            );
    }

    searchArticles(searchTerm) {
        const articles = document.querySelectorAll('.article-card');
        
        articles.forEach(article => {
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
            const tags = Array.from(article.querySelectorAll('.tag'))
                .map(tag => tag.textContent.toLowerCase())
                .join(' ');
            
            const matchesSearch = title.includes(searchTerm) || 
                                excerpt.includes(searchTerm) || 
                                tags.includes(searchTerm);
            
            const matchesFilter = this.currentFilter === 'all' || 
                                article.getAttribute('data-category') === this.currentFilter;
            
            if (matchesSearch && matchesFilter) {
                article.style.display = 'block';
                article.classList.add('search-match');
            } else {
                article.style.display = 'none';
                article.classList.remove('search-match');
            }
        });
    }

    setupLoadMore() {
        const loadMoreBtn = document.getElementById('load-more');
        
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }
    }

    loadMoreArticles() {
        // Simulate loading more articles
        const loadMoreBtn = document.getElementById('load-more');
        const originalText = loadMoreBtn.innerHTML;
        
        loadMoreBtn.innerHTML = '<span>Loading...</span><i class="bx bx-loader-alt bx-spin"></i>';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            // In a real application, you would fetch more articles from an API
            loadMoreBtn.innerHTML = originalText;
            loadMoreBtn.disabled = false;
            
            // For demo purposes, just show a message
            this.showNotification('No more articles to load', 'info');
        }, 1500);
    }

    setupArticleAnimations() {
        const articleCards = document.querySelectorAll('.article-card');
        
        articleCards.forEach((card, index) => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
            
            // Add click animation
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.article-link')) {
                    this.createRippleEffect(e, card);
                }
            });
        });
    }

    setupNewsletterForm() {
        const newsletterBtn = document.querySelector('.newsletter-btn');
        const newsletterInput = document.querySelector('.newsletter-input');
        
        if (newsletterBtn && newsletterInput) {
            newsletterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = newsletterInput.value.trim();
                
                if (this.validateEmail(email)) {
                    this.subscribeNewsletter(email);
                } else {
                    this.showNotification('Please enter a valid email address', 'error');
                }
            });
            
            newsletterInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    newsletterBtn.click();
                }
            });
        }
    }

    subscribeNewsletter(email) {
        const newsletterBtn = document.querySelector('.newsletter-btn');
        const originalText = newsletterBtn.innerHTML;
        
        newsletterBtn.innerHTML = '<span>Subscribing...</span><i class="bx bx-loader-alt bx-spin"></i>';
        newsletterBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            newsletterBtn.innerHTML = originalText;
            newsletterBtn.disabled = false;
            
            document.querySelector('.newsletter-input').value = '';
            this.showNotification('Successfully subscribed to newsletter!', 'success');
        }, 2000);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let current = 0;
            const increment = target / 50;
            
            const updateStat = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target;
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateStat();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(stat);
        });
    }

    initializeParticles() {
        const particlesContainer = document.getElementById('particles-articles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    setupScrollEffects() {
        const navbar = document.getElementById('navbar');
        const backToTop = document.getElementById('back-to-top');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            // Navbar background
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Back to top button
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Back to top functionality
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                document.body.classList.toggle('dark-theme');
                
                if (document.body.classList.contains('light-theme')) {
                    themeIcon.className = 'bx bx-sun theme-icon';
                } else {
                    themeIcon.className = 'bx bx-moon theme-icon';
                }
            });
        }
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bx ${type === 'success' ? 'bx-check-circle' : type === 'error' ? 'bx-error-circle' : 'bx-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChil


d(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Add floating animation keyframes
const floatingStyles = document.createElement('style');
floatingStyles.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }
    
    .particle {
        pointer-events: none;
    }
    
    .notification {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(floatingStyles);

// Initialize articles controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ArticlesController();
});

// Export for use in other scripts
window.ArticlesController = ArticlesController;

