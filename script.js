// ============================
// Apple-Inspired Portfolio JS
// ============================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animations and interactions
    initNavigation();
    initScrollAnimations();
    initCounterAnimations();
    initSmoothScroll();
    initParallaxOrbs();
    initTypingEffect();
});

// ============================
// Navigation
// ============================
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScroll = 0;
    
    // Scroll behavior
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.boxShadow = 'none';
        }
        
        // Hide/show nav on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile toggle
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 200;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    });
}

// ============================
// Scroll Reveal Animations
// ============================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('.stagger');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('active');
                });
            }
        });
    }, observerOptions);
    
    // Observe elements
    const revealElements = document.querySelectorAll('.section-header, .skill-category, .timeline-item, .project-card, .cert-card, .contact-link, .highlight-card');
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
    
    // Add reveal class styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                        transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
        .skill-category:nth-child(1) { transition-delay: 0s; }
        .skill-category:nth-child(2) { transition-delay: 0.1s; }
        .skill-category:nth-child(3) { transition-delay: 0.2s; }
        .skill-category:nth-child(4) { transition-delay: 0.3s; }
        .skill-category:nth-child(5) { transition-delay: 0.4s; }
        .skill-category:nth-child(6) { transition-delay: 0.5s; }
        .timeline-item:nth-child(1) { transition-delay: 0s; }
        .timeline-item:nth-child(2) { transition-delay: 0.15s; }
        .timeline-item:nth-child(3) { transition-delay: 0.3s; }
        .cert-card:nth-child(1) { transition-delay: 0s; }
        .cert-card:nth-child(2) { transition-delay: 0.1s; }
        .cert-card:nth-child(3) { transition-delay: 0.2s; }
    `;
    document.head.appendChild(style);
}

// ============================
// Counter Animations
// ============================
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 2000;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const isDecimal = target % 1 !== 0;
                
                animateCounter(counter, target, isDecimal, speed);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, isDecimal, duration) {
    const startTime = performance.now();
    const startValue = 0;
    
    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const currentValue = startValue + (target - startValue) * easedProgress;
        
        if (isDecimal) {
            element.textContent = currentValue.toFixed(1);
        } else {
            element.textContent = Math.floor(currentValue);
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ============================
// Smooth Scroll
// ============================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================
// Parallax Orbs
// ============================
function initParallaxOrbs() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const xMove = (x - 0.5) * speed;
            const yMove = (y - 0.5) * speed;
            
            orb.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    });
}

// ============================
// Typing Effect for Code Window
// ============================
function initTypingEffect() {
    const codeContent = document.querySelector('.code-content code');
    if (!codeContent) return;
    
    const originalHTML = codeContent.innerHTML;
    const text = codeContent.textContent;
    
    // Only run once when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reset and type
                codeContent.innerHTML = '';
                codeContent.style.visibility = 'visible';
                typeCode(codeContent, originalHTML);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(codeContent.closest('.code-window'));
}

function typeCode(element, html) {
    let i = 0;
    const speed = 15;
    let currentHTML = '';
    let inTag = false;
    let tagBuffer = '';
    
    function type() {
        if (i < html.length) {
            const char = html[i];
            
            if (char === '<') {
                inTag = true;
                tagBuffer = '<';
            } else if (char === '>') {
                inTag = false;
                tagBuffer += '>';
                currentHTML += tagBuffer;
                tagBuffer = '';
                element.innerHTML = currentHTML;
            } else if (inTag) {
                tagBuffer += char;
            } else {
                currentHTML += char;
                element.innerHTML = currentHTML;
            }
            
            i++;
            setTimeout(type, inTag ? 0 : speed);
        }
    }
    
    type();
}

// ============================
// Skill Tags Hover Effect
// ============================
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ============================
// Timeline Animation
// ============================
document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const marker = this.querySelector('.timeline-marker');
        marker.style.transform = 'scale(1.5)';
    });
    
    item.addEventListener('mouseleave', function() {
        const marker = this.querySelector('.timeline-marker');
        marker.style.transform = 'scale(1)';
    });
});

// ============================
// Project Card 3D Tilt Effect
// ============================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ============================
// Magnetic Button Effect
// ============================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});

// ============================
// Contact Card Glow Effect
// ============================
const contactCard = document.querySelector('.contact-card');
if (contactCard) {
    contactCard.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.background = `
            radial-gradient(
                600px circle at ${x}px ${y}px,
                rgba(0, 113, 227, 0.1),
                transparent 40%
            ),
            rgba(255, 255, 255, 0.05)
        `;
    });
    
    contactCard.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.05)';
    });
}

// ============================
// Cursor Trail Effect (optional - performance consideration)
// ============================
function initCursorTrail() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-trail';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        for (let i = 0; i < 2; i++) {
            particles.push({
                x: mouseX,
                y: mouseY,
                radius: Math.random() * 3 + 1,
                alpha: 1,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 113, 227, ${p.alpha})`;
            ctx.fill();
            
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
            
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Uncomment to enable cursor trail (may affect performance)
// initCursorTrail();

// ============================
// Page Load Animation
// ============================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements sequentially
    const heroElements = document.querySelectorAll('.hero .fade-in');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
    });
});

// ============================
// Preloader (optional)
// ============================
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">BSB</div>
            <div class="preloader-bar">
                <div class="preloader-progress"></div>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .preloader {
            position: fixed;
            inset: 0;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s, visibility 0.5s;
        }
        .preloader.hidden {
            opacity: 0;
            visibility: hidden;
        }
        .preloader-content {
            text-align: center;
        }
        .preloader-logo {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(90deg, #0071e3, #bf5af2, #ff375f);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 24px;
        }
        .preloader-bar {
            width: 200px;
            height: 3px;
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
            overflow: hidden;
        }
        .preloader-progress {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #0071e3, #bf5af2);
            animation: load 1.5s ease-in-out forwards;
        }
        @keyframes load {
            to { width: 100%; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.prepend(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 500);
        }, 1500);
    });
}

// Uncomment to enable preloader
// initPreloader();

console.log('🚀 Portfolio loaded successfully!');
