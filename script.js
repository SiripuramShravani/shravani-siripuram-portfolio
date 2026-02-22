/*==============================================
  SHRAVANI SIRIPURAM - PORTFOLIO WEBSITE
  JavaScript - Interactive Features & Animations
==============================================*/

// ===== DOM LOADED =====
document.addEventListener('DOMContentLoaded', function () {
    // Fix URL hash on initial load - scroll to top and clear hash
    if (window.location.hash && window.location.hash !== '#home') {
        // If there's a hash but it's not intentional navigation, clear it
        setTimeout(() => {
            window.scrollTo(0, 0);
            // Remove hash from URL without reloading the page
            history.replaceState(null, null, window.location.pathname);
        }, 0);
    }

    // Initialize all features
    initNavigation();
    initScrollProgress();
    initScrollAnimations();
    initCounters();
    initSkillBars();
    initTypingAnimation();
    initBackToTop();
});

// ===== NAVIGATION =====
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active section highlighting on scroll
    window.addEventListener('scroll', () => {
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active section
        let current = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ===== SCROLL ANIMATIONS - Intersection Observer =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Add 'reveal' class to elements that should animate on scroll
    const revealElements = document.querySelectorAll(
        '.achievement-card, .skill-card, .timeline-item, .project-card, ' +
        '.linkedin-card, .education-card, .award-card, .about-container'
    );

    revealElements.forEach(element => {
        element.classList.add('reveal');
        observer.observe(element);
    });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
    const counters = document.querySelectorAll('.achievement-number');
    let countersActivated = false;

    // Calculate years of experience dynamically
    const startDate = new Date('2023-08-01');
    const currentDate = new Date();
    const yearsOfExperience = (currentDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);

    // Update the experience counter's data-target
    const experienceCounter = document.getElementById('experience-counter');
    if (experienceCounter) {
        experienceCounter.setAttribute('data-target', yearsOfExperience.toFixed(1));
    }

    const observerOptions = {
        threshold: 0
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersActivated) {
                countersActivated = true;
                animateCounters();
            }
        });
    }, observerOptions);

    // Observe the achievements section
    const achievementsSection = document.querySelector('.achievements');
    if (achievementsSection) {
        counterObserver.observe(achievementsSection);
    }

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const customDisplay = counter.getAttribute('data-display');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    // Check for custom display (like "Enterprise" for SAP)
                    if (customDisplay) {
                        const progress = Math.floor((current / target) * 100);
                        counter.textContent = progress + '%';
                    }
                    // Format number with decimal if it has one
                    else if (target % 1 !== 0) {
                        counter.textContent = current.toFixed(1) + '+';
                    } else {
                        counter.textContent = Math.floor(current) + (target >= 10 ? '+' : '');
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    // Final value
                    if (customDisplay) {
                        counter.textContent = customDisplay;
                    } else if (target % 1 !== 0) {
                        counter.textContent = target.toFixed(1) + '+';
                    } else if (counter.parentElement.querySelector('.achievement-label').textContent.includes('Uptime')) {
                        counter.textContent = target + '%+';
                    } else if (counter.parentElement.querySelector('.achievement-label').textContent.includes('Manual Work')) {
                        counter.textContent = target + '%';
                    } else if (counter.parentElement.querySelector('.achievement-label').textContent.includes('Speed')) {
                        counter.textContent = target + 'x';
                    } else {
                        counter.textContent = target + (target >= 10 ? '+' : '');
                    }
                }
            };

            updateCounter();
        });
    }
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observerOptions = {
        threshold: 0.5
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                entry.target.classList.add('animated');
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const text = typingText.textContent;
    typingText.textContent = '';
    typingText.style.opacity = '1';

    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            typingText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, 50); // Typing speed
        }
    }

    // Start typing after page loads
    setTimeout(type, 1500);
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// Parallax effect for hero background removed - caused layout overlap with subsequent sections

// Add smooth hover effect to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) rotate(1deg)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) rotate(0)';
    });
});

// Console message for recruiters
console.log('%c👋 Hello Recruiter!', 'color: #64FFDA; font-size: 24px; font-weight: bold;');
console.log('%cThanks for checking out the code!', 'color: #8892B0; font-size: 16px;');
console.log('%cThis portfolio is built with vanilla HTML, CSS, and JavaScript.', 'color: #8892B0; font-size: 14px;');
console.log('%cFeel free to reach out: ssiripuram46@gmail.com', 'color: #64FFDA; font-size: 14px;');

// Performance optimization - Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
