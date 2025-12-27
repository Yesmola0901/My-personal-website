document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle (Simple implementation)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.right = '0';
                navLinks.style.background = 'var(--glass-bg)';
                navLinks.style.width = '200px';
                navLinks.style.padding = '1rem';
                navLinks.style.borderRadius = '16px';
                navLinks.style.backdropFilter = 'blur(12px)';
                navLinks.style.border = '1px solid var(--glass-border)';
            }
        });
    }
    // Flipable Card Logic with 3-Image Cycle
    const cardContainer = document.querySelector('.profile-card-container');
    const cardInner = document.querySelector('.profile-card-inner');
    const frontImg = document.querySelector('.profile-card-front .card-img');
    const backImg = document.querySelector('.profile-card-back .card-img');

    // Image sources
    const images = [
        'images/outdoor.jpg',
        'images/profile.jpg',
        'images/singing.png'
    ];

    let currentIndex = 0; // Currently visible image index (starts at 0 on front)
    let rotation = 0;

    if (cardContainer && cardInner && frontImg && backImg) {
        // Initialize: Front=0, Back=1
        frontImg.src = images[0];
        backImg.src = images[1];

        cardContainer.addEventListener('click', () => {
            rotation += 180;
            cardInner.style.transform = `rotateY(${rotation}deg)`;

            // Logic:
            // If we just rotated to 180 (Back visible, Index 1), we need to prepare Front for the NEXT flip (Index 2).
            // If we just rotated to 360 (Front visible, Index 2), we need to prepare Back for NEXT flip (Index 0).

            // We wait half the transition time (400ms) or full time (800ms) to update the hidden face.
            // Let's update after 400ms so it's ready when we flip back.

            setTimeout(() => {
                // Determine which face is now HIDDEN and needs updating
                const isBackVisible = (rotation / 180) % 2 !== 0;

                // Calculate next image index to show
                // If Back is visible (showing images[1]), next click will show Front. Front should have images[2].
                // If Front is visible (showing images[2]), next click will show Back. Back should have images[0].

                // Current visible index comes from state, but let's just track "next load"
                const nextImageIndex = (currentIndex + 2) % images.length;

                if (isBackVisible) {
                    // Back is visible. Front is hidden. Update Front.
                    frontImg.src = images[nextImageIndex];
                } else {
                    // Front is visible. Back is hidden. Update Back.
                    backImg.src = images[nextImageIndex];
                }

                // Update current index to what is now visible
                currentIndex = (currentIndex + 1) % images.length;

            }, 400); // Update halfway through or just after? 
            // Actually, if we update halfway (90deg), it might glitch if visible.
            // 3D transform hides backface, so updating the hidden face is safe once it's strictly behind.
            // 400ms is halfway of 0.8s. reliable enough.
        });
    }
});
