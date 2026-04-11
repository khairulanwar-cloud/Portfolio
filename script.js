// Document Ready
document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Typing Effect for Title
    const texts = [
        "Software Quality Assurance",
        "Test Automation Engineer",
        "Data Validation Specialist",
        "Data Visualization",
        "Bug Hunter"
    ];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    let isDeleting = false;
    const typingElement = document.querySelector('.typing-text');

    function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        typingElement.textContent = letter;

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing effect
    setTimeout(type, 1000);

    // 3. Scroll Reveal Animation
    function reveal() {
        var reveals = document.querySelectorAll('.reveal');
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }

    // Trigger reveal on load and scroll
    window.addEventListener('scroll', reveal);
    reveal(); // Initial check

    // 4. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetNode = document.querySelector(targetId);
            if (targetNode) {
                const navHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: targetNode.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
});
