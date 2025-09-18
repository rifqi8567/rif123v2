// ===== CERTIFICATE TRANSITION CONTROLLER =====

class CertificateTransition {
    constructor() {
        this.init();
    }

    init() {
        this.createTransitionOverlay();
        this.setupTransitionTriggers();
        this.setupCertificatePageAnimations();
    }

    createTransitionOverlay() {
        // Create transition overlay if it doesn't exist
        if (!document.querySelector('.certificate-transition')) {
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
    }

 setupTransitionTriggers() {
    // === Hanya tombol View All Certificates (class .btn) yang kena animasi ===
    const viewCertificateButtons = document.querySelectorAll('.btn[href="certificates.html"]');
    viewCertificateButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.showTransition(() => {
                window.location.href = 'certificates.html';
            });
        });
    });

    // === Link internal ke section certificates (kalau ada di halaman yang sama) ===
    const sectionLinks = document.querySelectorAll('.nav-link[data-section="certificates"]');
    sectionLinks.forEach(link => {
        link.addEventListener('click', () => {
            this.showBriefTransition();
        });
    });

    // === Navbar Certificates ===
    // Biarkan default behaviour, jangan kasih event listener sama sekali
    // Jadi klik navbar Certificates akan langsung pindah tanpa animasi
}



    setupCertificatePageAnimations() {
        // Only run on certificate page
        if (window.location.pathname.includes('certificates.html') || 
            document.title.includes('Certificates')) {
            
            this.animateCertificateCards();
            this.setupCertificateHoverEffects();
        }
    }

    showTransition(callback) {
        const overlay = document.querySelector('.certificate-transition');
        if (!overlay) return;

        // Show overlay
        overlay.classList.add('active');
        
        // Add clock animation
        const clockFace = overlay.querySelector('.clock-face');
        if (clockFace) {
            clockFace.style.animation = 'clockRotate 2s ease-in-out';
        }

        // Add text animation
        const transitionText = overlay.querySelector('.transition-text');
        if (transitionText) {
            transitionText.style.animation = 'certificateTextReveal 1s ease-out 0.5s both';
        }

        // Execute callback after animation
        setTimeout(() => {
            if (callback) callback();
        }, 2500);

        // Hide overlay after navigation
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 3000);
    }

    showBriefTransition() {
        const overlay = document.querySelector('.certificate-transition');
        if (!overlay) return;

        overlay.classList.add('active');
        
        // Shorter animation for same-page navigation
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 1000);
    }

    animateCertificateCards() {
        const certificateCards = document.querySelectorAll('.certificate-card, .cert-card');
        
        certificateCards.forEach((card, index) => {
            // Add rotation animation with staggered delay
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('certificate-rotate');
            
            // Add modern hover effects
            this.addCertificateHoverEffect(card);
        });
    }

    addCertificateHoverEffect(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'rotateY(10deg) rotateX(5deg) translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.2)';
            card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0px) scale(1)';
            card.style.boxShadow = '';
        });

        // Add click effect
        card.addEventListener('click', (e) => {
            this.createCertificateClickEffect(e, card);
        });
    }

    setupCertificateHoverEffects() {
        // Add floating animation to certificate images
        const certificateImages = document.querySelectorAll('.certificate-card img, .cert-card img');
        
        certificateImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05) rotate(2deg)';
                img.style.filter = 'brightness(1.1) contrast(1.1)';
                img.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });

            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1) rotate(0deg)';
                img.style.filter = 'brightness(1) contrast(1)';
            });
        });
    }

    createCertificateClickEffect(event, element) {
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
            background: radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: certificateRipple 0.8s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    }
}

// Add certificate-specific animations
const certificateAnimationStyles = document.createElement('style');
certificateAnimationStyles.textContent = `
    @keyframes certificateRipple {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }

    .certificate-rotate {
        animation: rotateIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }

    /* Enhanced certificate card styles */
    .certificate-card,
    .cert-card {
        transform-style: preserve-3d;
        backface-visibility: hidden;
        will-change: transform;
    }

    /* Certificate loading animation */
    .certificate-card.loading {
        animation: certificateLoad 1.2s ease-out both;
    }

    @keyframes certificateLoad {
        0% {
            opacity: 0;
            transform: translateY(50px) rotateX(-10deg);
        }
        50% {
            opacity: 0.7;
            transform: translateY(-10px) rotateX(5deg);
        }
        100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
        }
    }

    /* Certificate grid animation */
    .certificates-grid .certificate-card:nth-child(1) { animation-delay: 0.1s; }
    .certificates-grid .certificate-card:nth-child(2) { animation-delay: 0.2s; }
    .certificates-grid .certificate-card:nth-child(3) { animation-delay: 0.3s; }
    .certificates-grid .certificate-card:nth-child(4) { animation-delay: 0.4s; }
    .certificates-grid .certificate-card:nth-child(5) { animation-delay: 0.5s; }
    .certificates-grid .certificate-card:nth-child(6) { animation-delay: 0.6s; }
`;
document.head.appendChild(certificateAnimationStyles);

// Initialize certificate transition when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CertificateTransition();
});

// Export for use in other scripts
window.CertificateTransition = CertificateTransition;

