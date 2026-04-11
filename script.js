// ========================= PARTICLE NETWORK =========================
(function () {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const PRIMARY = { r: 0, g: 209, b: 255 };
    const PARTICLE_COUNT = 70;
    const CONNECTION_DIST = 160;
    const MOUSE_REPEL_DIST = 100;
    const BASE_SPEED = 0.35;

    let mouse = { x: -9999, y: -9999 };
    let particles = [];
    let animId;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function createParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = randomBetween(BASE_SPEED * 0.4, BASE_SPEED);
        return {
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: randomBetween(1.2, 2.6),
            opacity: randomBetween(0.3, 0.8),
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PRIMARY.r},${PRIMARY.g},${PRIMARY.b},${p.opacity})`;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = `rgba(${PRIMARY.r},${PRIMARY.g},${PRIMARY.b},0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function drawConnection(p1, p2, alpha) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${PRIMARY.r},${PRIMARY.g},${PRIMARY.b},${alpha})`;
        ctx.lineWidth   = 0.7;
        ctx.stroke();
    }

    function updateParticle(p) {
        // Mouse soft-repel
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_REPEL_DIST) {
            const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST * 0.6;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
        }

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > BASE_SPEED * 2.5) {
            p.vx = (p.vx / speed) * BASE_SPEED * 2.5;
            p.vy = (p.vy / speed) * BASE_SPEED * 2.5;
        }
        // Gradual return to base speed
        if (speed > BASE_SPEED) {
            p.vx *= 0.985;
            p.vy *= 0.985;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = canvas.width  + 10;
        if (p.x > canvas.width  + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections first (below particles)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
                    drawConnection(particles[i], particles[j], alpha);
                }
            }
        }

        // Draw & update particles
        for (const p of particles) {
            updateParticle(p);
            drawParticle(p);
        }

        animId = requestAnimationFrame(loop);
    }

    // Init
    resize();
    initParticles();
    loop();

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });
})();

// ========================= DOCUMENT READY =========================
document.addEventListener('DOMContentLoaded', () => {

    // 1. Footer Year
    document.getElementById('footer-year').textContent = new Date().getFullYear();

    // 2. Typing Effect
    const texts = [
        "Software Quality Assurance",
        "Test Automation Engineer",
        "Data Validation Specialist",
        "Data Visualization Expert",
        "Bug Hunter"
    ];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    let isDeleting = false;
    const typingEl = document.getElementById('typing-text');

    function type() {
        if (count === texts.length) count = 0;
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        if (typingEl) typingEl.textContent = letter;

        let speed = isDeleting ? 45 : 90;
        if (!isDeleting && letter.length === currentText.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            speed = 500;
        }
        setTimeout(type, speed);
    }
    setTimeout(type, 800);

    // 3. Scroll Reveal
    function reveal() {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', reveal, { passive: true });
    reveal();

    // 4. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active', 'text-primary');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active', 'text-primary');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // 5. Navbar scroll shadow
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-[0_2px_24px_rgba(0,0,0,0.4)]');
        } else {
            navbar.classList.remove('shadow-[0_2px_24px_rgba(0,0,0,0.4)]');
        }
    }, { passive: true });

    // 6. Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });
    // Close menu on mobile link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });

    // 7. Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navH = navbar.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - navH,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 8. Contact form submission handler
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = '✓ Message Sent!';
            btn.classList.add('bg-green-500', 'text-white');
            btn.classList.remove('bg-primary', 'text-on-primary');
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = 'Send Message <span class="material-symbols-outlined">send</span>';
                btn.classList.remove('bg-green-500', 'text-white');
                btn.classList.add('bg-primary', 'text-on-primary');
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }
});
