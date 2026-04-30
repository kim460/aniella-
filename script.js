
        // Theme Toggle
        function toggleTheme() {
            document.body.classList.toggle('dark');
            const icon = document.querySelector('.theme-btn i');
            if (document.body.classList.contains('dark')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark');
            document.querySelector('.theme-btn i').classList.replace('fa-moon', 'fa-sun');
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const icon = document.querySelector('.theme-btn i');
            if (event.matches) {
                document.body.classList.add('dark');
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                document.body.classList.remove('dark');
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });

        // Mobile Menu
        function openMobileMenu() {
            document.getElementById('mobileMenu').classList.add('active');
        }

        function closeMobileMenu() {
            document.getElementById('mobileMenu').classList.remove('active');
        }

        // Navbar Scroll Effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Active Navigation Link
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - 200) {
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

        // Fade In Animation on Scroll
        const fadeElements = document.querySelectorAll('.fade-in');

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => fadeObserver.observe(el));

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Gallery Tabs
        const galleryTabs = document.querySelectorAll('.gallery-tab');
        const galleryContents = document.querySelectorAll('.gallery-tab-content');

        galleryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                galleryTabs.forEach(t => t.classList.remove('active'));
                galleryContents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });

        // Gallery Lightbox
        const galleryCards = document.querySelectorAll('.gallery-card img');
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        document.body.appendChild(lightbox);

        galleryCards.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.querySelector('img').src = img.src;
                lightbox.querySelector('img').alt = img.alt;
                lightbox.classList.add('active');
            });
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.classList.remove('active');
            }
        });

        // Contact form handling with Web3Forms
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('contactName').value.trim();
                const email = document.getElementById('contactEmail').value.trim();
                const subject = document.getElementById('contactSubject').value.trim();
                const message = document.getElementById('contactMessage').value.trim();
                const successEl = document.getElementById('contactSuccess');

                if (!name || !email || !message) {
                    alert('Please fill in your name, email and message.');
                    return;
                }

                const validEmail = (em) => /\S+@\S+\.\S+/.test(em);
                if (!validEmail(email)) {
                    alert('Please provide a valid email address.');
                    return;
                }

                successEl.hidden = false;
                successEl.textContent = 'Sending...';

                const formData = new FormData();
                formData.append('access_key', '53e2db23-d6c3-47dc-852d-cbd8a0686023'); // Web3Forms access key
                formData.append('name', name);
                formData.append('email', email);
                formData.append('subject', subject || 'Contact Form Submission');
                formData.append('message', message);
                formData.append('reply_to', email);
                formData.append('honeypot', '');
                formData.append('redirect', '');

                try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    const result = await response.json();
                    if (response.ok && result.success) {
                        successEl.textContent = 'Thanks — your message has been sent.';
                        contactForm.reset();
                        setTimeout(() => { successEl.hidden = true; }, 4000);
                    } else {
                        throw new Error(result.message || 'Form submission failed');
                    }
                } catch (error) {
                    console.error('Web3Forms error:', error);
                    successEl.textContent = 'Failed to send message. Please try again.';
                    setTimeout(() => { successEl.hidden = true; }, 4000);
                }
            });
        }
    