// ==========================================
// EMAILJS CONFIGURATION
// ==========================================
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'WxtksewvrMb5ls1fv',     // Replace with your EmailJS Public Key
    SERVICE_ID: 'service_4p4nfgf',     // Replace with your EmailJS Service ID
    TEMPLATE_ID: 'template_q0vfofl'    // Replace with your EmailJS Template ID
};

// Initialize EmailJS immediately when the script loads
if (typeof emailjs !== 'undefined') {
    emailjs.init({
        publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================
    // 1. PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const fadeOutPreloader = () => {
            if (!preloader.classList.contains('fade-out')) {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600); // Matches the transition slow speed (0.6s)
            }
        };

        if (document.readyState === 'complete') {
            fadeOutPreloader();
        } else {
            window.addEventListener('load', fadeOutPreloader);
            
            // Safety timeout in case load event takes too long
            setTimeout(fadeOutPreloader, 3000);
        }
    }

    // ==========================================
    // 2. STICKY NAVIGATION BAR
    // ==========================================
    const header = document.getElementById('header');
    const handleScrollHeader = () => {
        if (window.scrollY >= 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Call initially on load

    // ==========================================
    // 3. RESPONSIVE HAMBURGER MENU
    // ==========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle menu/close icon
            const icon = navToggle.querySelector('i');
            if (icon) {
                const isMenu = icon.getAttribute('data-lucide') === 'menu';
                icon.setAttribute('data-lucide', isMenu ? 'x' : 'menu');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons({
                        attrs: {
                            id: 'nav-toggle'
                        },
                        nameAttr: 'data-lucide'
                    });
                }
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        });
    }

    // ==========================================
    // 4. TYPEWRITER ANIMATION (HERO)
    // ==========================================
    const typewriterText = document.getElementById('typewriter-text');
    if (typewriterText) {
        const words = JSON.parse(typewriterText.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 150;

        const type = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Delete character
                typewriterText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // Deleting is faster
            } else {
                // Type character
                typewriterText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 150;
            }

            // Word completes typing
            if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } 
            // Word completes deleting
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length; // Next word
                typingSpeed = 500; // Brief pause before typing next
            }

            setTimeout(type, typingSpeed);
        };

        // Start typing after preloader finishes
        setTimeout(type, 1000);
    }

    // ==========================================
    // 5. ACTIVE NAVIGATION HIGHLIGHT
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    const scrollActive = () => {
        const scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for sticky header
            const sectionId = current.getAttribute('id');
            const navLink = document.getElementById(`nav-link-${sectionId}`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };
    window.addEventListener('scroll', scrollActive);
    scrollActive();

    // ==========================================
    // 6. ANIMATED SKILLS PROGRESS BARS
    // ==========================================
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.getElementById('skills');

    if (skillsSection && skillProgressBars.length > 0) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate bars to their targeted widths
                    skillProgressBars.forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.width = progress;
                    });
                    // Once animated, we don't need to observe anymore
                    skillObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15 // Trigger when 15% of section is visible
        });

        skillObserver.observe(skillsSection);
    }

    // ==========================================
    // 7. CONTACT FORM VALIDATION & SIMULATION
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const messageInput = document.getElementById('form-message');
        const submitBtn = document.getElementById('btn-submit-form');
        const formStatus = document.getElementById('form-status');

        const validateEmail = (email) => {
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return re.test(String(email).toLowerCase());
        };

        const validateField = (input, errorId, validator = null) => {
            if (!input) return false;
            const parent = input.parentElement;
            let isValid = true;

            if (!input.value.trim()) {
                isValid = false;
            } else if (validator && !validator(input.value)) {
                isValid = false;
            }

            if (!isValid) {
                parent.classList.add('invalid');
            } else {
                parent.classList.remove('invalid');
            }

            return isValid;
        };

        // Real-time input listener to clear error states
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    input.parentElement.classList.remove('invalid');
                });
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Run validations
            const isNameValid = validateField(nameInput, 'name-error');
            const isEmailValid = validateField(emailInput, 'email-error', validateEmail);
            const isSubjectValid = validateField(subjectInput, 'subject-error');
            const isMessageValid = validateField(messageInput, 'message-error');

            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                // Show loading state
                const btnText = submitBtn.querySelector('.btn-text');
                const btnSpinner = submitBtn.querySelector('.btn-spinner');
                
                if (btnText && btnSpinner) {
                    btnText.classList.add('hidden');
                    btnSpinner.classList.remove('hidden');
                }
                submitBtn.disabled = true;

                // Prepare EmailJS template parameters
                const templateParams = {
                    from_name: nameInput.value.trim(),
                    from_email: emailInput.value.trim(),
                    subject: subjectInput.value.trim(),
                    message: messageInput.value.trim()
                };

                // Send email using EmailJS
                if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
                        .then(() => {
                            // Reset button state
                            if (btnText && btnSpinner) {
                                btnText.classList.remove('hidden');
                                btnSpinner.classList.add('hidden');
                            }
                            submitBtn.disabled = false;

                            // Show success status
                            formStatus.textContent = 'Thank you! Your message was sent successfully.';
                            formStatus.className = 'form-status success';
                            formStatus.classList.remove('hidden');
                            
                            // Clear inputs
                            contactForm.reset();

                            // Hide status after a delay
                            setTimeout(() => {
                                formStatus.classList.add('hidden');
                            }, 5000);
                        })
                        .catch((error) => {
                            console.error('EmailJS Error:', error);
                            
                            // Reset button state
                            if (btnText && btnSpinner) {
                                btnText.classList.remove('hidden');
                                btnSpinner.classList.add('hidden');
                            }
                            submitBtn.disabled = false;

                            // Show error status
                            formStatus.textContent = 'Oops! Something went wrong. Please try again later.';
                            formStatus.className = 'form-status error';
                            formStatus.classList.remove('hidden');
                        });
                } else {
                    // Fallback simulated response if EmailJS keys are not configured yet
                    console.warn('EmailJS is not configured. Running simulation mode.');
                    setTimeout(() => {
                        if (btnText && btnSpinner) {
                            btnText.classList.remove('hidden');
                            btnSpinner.classList.add('hidden');
                        }
                        submitBtn.disabled = false;

                        formStatus.textContent = 'Demo Mode: Form validation passed! Please configure EmailJS keys to send actual emails.';
                        formStatus.className = 'form-status success';
                        formStatus.classList.remove('hidden');
                        
                        contactForm.reset();

                        setTimeout(() => {
                            formStatus.classList.add('hidden');
                        }, 5000);
                    }, 1500);
                }
            } else {
                formStatus.textContent = 'Please correct the highlighted fields before sending.';
                formStatus.className = 'form-status error';
                formStatus.classList.remove('hidden');
            }
        });
    }

    // ==========================================
    // 8. BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= 600) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 9. AUTOMATIC COPYRIGHT YEAR DYNAMIC UPDATE
    // ==========================================
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
