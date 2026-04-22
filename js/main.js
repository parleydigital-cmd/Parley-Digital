// ==========================================================================
// Navigation & Header Scroll State
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Header scroll effect
    const handleScroll = () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init

    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
            }
        });
    }

    // ==========================================================================
    // Scroll Reveal (PERF-003)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15
    };
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ==========================================================================
    // Stats Counter Animation (HOME-002)
    // ==========================================================================
    const stats = document.querySelectorAll('.stat-item[data-target]');
    if (stats.length > 0) {
        // easeOutCubic easing function
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
        const duration = 2000;

        const startCounting = (el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            let startTimestamp = null;
            
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                // Calculate current count using easing
                const currentCount = Math.floor(easeOutCubic(progress) * target);
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';

                el.querySelector('.counter').innerText = prefix + currentCount + suffix;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.querySelector('.counter').innerText = prefix + target + suffix;
                }
            };
            
            window.requestAnimationFrame(step);
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounting(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => statsObserver.observe(stat));
    }

    // ==========================================================================
    // Testimonials Slider (HOME-005)
    // ==========================================================================
    const sliderContainer = document.querySelector('.slider-container');
    const track = document.querySelector('.slider-track');
    if (sliderContainer && track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.slider-next');
        const prevButton = document.querySelector('.slider-prev');
        const dotsContainer = document.querySelector('.slider-dots');
        
        let slideIndex = 0;
        let slideInterval = null;

        // Initialize dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        const updateSlider = () => {
            track.style.transform = `translateX(-${slideIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[slideIndex].classList.add('active');
        };

        const nextSlide = () => {
            slideIndex = (slideIndex + 1) % slides.length;
            updateSlider();
        };

        const prevSlide = () => {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            updateSlider();
        };

        const goToSlide = (index) => {
            slideIndex = index;
            updateSlider();
        };

        if (nextButton) nextButton.addEventListener('click', () => { nextSlide(); resetInterval(); });
        if (prevButton) prevButton.addEventListener('click', () => { prevSlide(); resetInterval(); });

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderContainer.addEventListener('mouseleave', startInterval);

        startInterval();
    }

    // ==========================================================================
    // FAQ Accordion (SVC-003)
    // ==========================================================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const parentItem = question.parentElement;
                const isActive = parentItem.classList.contains('active');

                // Close all
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Toggle current
                if (!isActive) {
                    parentItem.classList.add('active');
                }
            });
        });
    }

    // ==========================================================================
    // Contact Form AJAX Submit (CON-001)
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Client-side validation (basic)
            const name = contactForm.querySelector('input[name="name"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            
            if (!name || !email) {
                if (formResponse) {
                    formResponse.innerText = "Please fill in required fields.";
                    formResponse.style.color = "red";
                }
                return;
            }

            const formData = new FormData(contactForm);
            const button = contactForm.querySelector('button[type="submit"]');
            const originalText = button.innerText;
            button.innerText = "Sending...";
            button.disabled = true;

            try {
                // YOUR_FORM_ID to be replaced by client
                const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    if (formResponse) {
                        formResponse.innerText = "Thanks for reaching out! We'll be in touch soon.";
                        formResponse.style.color = "green";
                    }
                    contactForm.reset();
                } else {
                    if (formResponse) {
                        formResponse.innerText = "Oops! There was a problem submitting your form.";
                        formResponse.style.color = "red";
                    }
                }
            } catch (error) {
                if (formResponse) {
                    formResponse.innerText = "Oops! Network error. Please try again later.";
                    formResponse.style.color = "red";
                }
            } finally {
                button.innerText = originalText;
                button.disabled = false;
            }
        });
    }
});
