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
    // EmailJS Form Submit Integration (CON-001)
    // ==========================================================================
    const sendEmailJS = async (formElement, isStrategyForm = false) => {
        const formData = new FormData(formElement);
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        
        let formResponse = document.getElementById(isStrategyForm ? 'form-success' : 'formResponse');
        
        // Basic validation
        if(!formElement.checkValidity()) {
            formElement.reportValidity();
            return;
        }

        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        // Build template params
        const templateParams = {};
        for (let [key, value] of formData.entries()) {
            templateParams[key] = value;
        }
        // Add form type identifier
        templateParams.form_type = isStrategyForm ? "Strategy Audit Form" : "Contact Form";

        const payload = {
            service_id: 'service_r02jdjm',
            template_id: 'template_qw4pm8b',
            user_id: 'GwmRHNLeR7budPryZ',
            template_params: templateParams
        };

        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                if (isStrategyForm) {
                    formElement.style.display = 'none';
                    if (formResponse) formResponse.style.display = 'block';
                } else {
                    if (formResponse) {
                        formResponse.innerText = "Thanks for reaching out! We'll be in touch soon.";
                        formResponse.style.color = "green";
                    }
                    formElement.reset();
                }
            } else {
                throw new Error("Failed to send");
            }
        } catch (error) {
            if (formResponse) {
                formResponse.innerText = "Oops! Network error. Please try again later.";
                formResponse.style.color = "red";
                formResponse.style.display = 'block';
            }
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    };

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendEmailJS(contactForm, false);
        });
    }

    const strategyForm = document.getElementById('strategy-form');
    if (strategyForm) {
        strategyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendEmailJS(strategyForm, true);
        });
    }
});
