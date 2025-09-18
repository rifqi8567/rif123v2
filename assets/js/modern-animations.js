// ===== MODERN ANIMATIONS CONTROLLER =====

class ModernAnimations {
    constructor() {
        this.init();
        this.setupIntersectionObserver();
        this.setupCertificateTransition();
        this.setupModernHoverEffects();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initAnimations());
        } else {
            this.initAnimations();
        }
    }

    initAnimations() {
        this.createCertificateTransitionOverlay();
        this.enhanceProjectCards();
        this.enhanceSkillItems();
        this.enhanceCertificateCards();
        this.enhanceEducationItems();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that need modern animations
        const elementsToObserve = [
            '.project-card',
            '.skill-item',
            '.certificate-card',
            '.education-item',
            '.section-header',
            '.about-stats .stat-item'
        ];

        elementsToObserve.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                observer.observe(el);
            });
        });
    }

    animateElement(element) {
        const animationType = this.getAnimationType(element);
        const delay = this.getStaggerDelay(element);
        
        setTimeout(() => {
            element.classList.add(animationType);
        }, delay);
    }

    getAnimationType(element) {
        if (element.classList.contains('project-card')) return 'modern-fade-up';
        if (element.classList.contains('skill-item')) return 'modern-scale-in';
        if (element.classList.contains('certificate-card')) return 'modern-bounce-in';
        if (element.classList.contains('education-item')) return 'modern-fade-left';
        if (element.classList.contains('section-header')) return 'modern-fade-up';
        if (element.classList.contains('stat-item')) return 'modern-slide-up';
        return 'modern-fade-up';
    }

    getStaggerDelay(element) {
        const siblings = Array.from(element.parentNode.children);
        const index = siblings.indexOf(element);
        return index * 100; // 100ms delay between each element
    }

    createCertificateTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'certificate-transition';
        overlay.innerHTML = `
            <div class="clock-container">
                <div class="clock-face">
                    <div class="hour-hand"></div>
                    <div class="minute-hand"></div>
                    <div class="second-hand"></div>
                    <div class="center-dot"></div>
                </div>
            </div>
            <div class="transition-text">
                My <span class="gradient-text">Certificates</span>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    setupCertificateTransition() {
        // Handle certificate navigation with transition
        const certificateLinks = document.querySelectorAll('a[href*="certificates"]');
        
        certificateLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Only apply transition if it's a link to certificates.html
                if (link.getAttribute('href') === 'certificates.html' || 
                    link.getAttribute('href').includes('certificates.html')) {
                    e.preventDefault();
                    this.showCertificateTransition(() => {
                        window.location.href = link.getAttribute('href');
                    });
                }
            });
        });
    }

    showCertificateTransition(callback) {
        const overlay = document.querySelector('.certificate-transition');
        if (!overlay) return;

        overlay.classList.add('active');
        
        // Hide transition after animation completes
        setTimeout(() => {
            overlay.classList.remove('active');
            if (callback) callback();
        }, 2500);
    }

    enhanceProjectCards() {
        const projectCards = document.querySelectorAll(".project-card");
        
        projectCards.forEach(card => {
            // Add 3D tilt effect on hover
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10; // Adjust sensitivity
                const rotateY = (x - centerX) / 10; // Adjust sensitivity

                card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                card.style.boxShadow = `0 ${Math.abs(rotateX)}px ${Math.abs(rotateY)}px rgba(0, 255, 255, 0.3)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
                card.style.boxShadow = "none";
            });

            // Add click ripple effect
            card.addEventListener("click", (e) => {
                this.createRippleEffect(e, card);
            });
        });
    }

    enhanceSkillItems() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach((item, index) => {
            // Add staggered animation class
            item.classList.add(`animate-stagger-${(index % 6) + 1}`);
            
            // Enhance progress bar animation
            const progressBar = item.querySelector('.skill-progress .progress-fill');
            if (progressBar) {
                this.animateProgressBar(progressBar);
            }
        });
    }

    enhanceCertificateCards() {
        const certificateCards = document.querySelectorAll('.certificate-card');
        
        certificateCards.forEach((card, index) => {
            // Add rotation animation class
            card.classList.add('certificate-rotate');
            
            // Add staggered delay
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add modern hover effects
            card.addEventListener('mouseenter', () => {
                this.addPulseGlow(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removePulseGlow(card);
            });
        });
    }

    enhanceEducationItems() {
        const educationItems = document.querySelectorAll(".education-item");
        
        educationItems.forEach((item, index) => {
            // Add staggered animation with a subtle slide-in and fade-up
            item.style.animation = `slideInUp 0.6s ease-out ${index * 0.15}s forwards`;
            item.style.opacity = 0; // Start hidden

            // Add a more pronounced pulse/glow effect to the timeline dot
            const timelineDot = item.querySelector(".timeline-dot");
            if (timelineDot) {
                timelineDot.classList.add("timeline-dot-animated");
            }

            // Add hover effect for education items
            item.addEventListener("mouseenter", () => {
                gsap.to(item, { duration: 0.3, scale: 1.02, ease: "power2.out" });
            });
            item.addEventListener("mouseleave", () => {
                gsap.to(item, { duration: 0.3, scale: 1, ease: "power2.out" });
            });
        });
    }

    setupModernHoverEffects() {
        // Add modern cursor effects
        this.setupCustomCursor();
        
        // Add magnetic effect to buttons
        this.setupMagneticButtons();
    }

    setupCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        if (!cursor || !cursorFollower) return;

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });

        // Add cursor effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .certificate-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            });
        });
    }

    setupMagneticButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    addFloatingEffect(element) {
        element.classList.add('modern-float');
    }

    removeFloatingEffect(element) {
        element.classList.remove('modern-float');
    }

    addPulseGlow(element) {
        element.classList.add('modern-pulse-glow');
    }

    removePulseGlow(element) {
        element.classList.remove('modern-pulse-glow');
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

    animateProgressBar(progressBar) {
        const targetWidth = progressBar.style.width || progressBar.getAttribute('data-width') || '0%';
        progressBar.style.width = '0%';
        
        setTimeout(() => {
            progressBar.style.width = targetWidth;
            progressBar.style.transition = 'width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, 500);
    }
}

// Add ripple animation keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize modern animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ModernAnimations();
});

// Export for use in other scripts
window.ModernAnimations = ModernAnimations;

