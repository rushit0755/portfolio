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
    // 0. DARK / LIGHT MODE THEME TOGGLE
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Apply saved theme on load (default: dark)
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        htmlEl.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            if (newTheme === 'light') {
                htmlEl.setAttribute('data-theme', 'light');
            } else {
                htmlEl.removeAttribute('data-theme');
            }

            localStorage.setItem('portfolio-theme', newTheme);
        });
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

    // ==========================================
    // 10. CHATBOT WIDGET LOGIC
    // ==========================================
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotSuggestions = document.getElementById('chatbot-suggestions');

    // Bot Response Database
    const botReplies = {
        greeting: "Hello! I am Rushit's Virtual Assistant. 🤖 How can I help you today? Feel free to ask about my skills, projects, resume, or contact info!",
        skills: "Rushit is skilled in **Web Development** (HTML, CSS, JavaScript, Responsive Design), **Backend Dev** (Python, Django), and **AI & Machine Learning** concepts. 🛠️",
        projects: "Some of Rushit's notable projects are:\n1. **Gym Management System** (Django & JS)\n2. **Personal Portfolio** (HTML, CSS, JS)\n3. **Python Mini Projects**\n\nYou can see them in detail in the Projects section! 🚀",
        resume: "You can download Rushit's resume by clicking the **'Download Resume'** button in the Hero section of the page! 📄",
        contact: "You can reach out to Rushit via:\n📧 Email: **rushit0755@gmail.com**\n💬 WhatsApp: **+91 879911870**\n🔗 LinkedIn: **rushit-prajapati-00093236b**\n📸 Instagram: **@rushit0755**\n\nOr simply fill out the contact form on this page! 📞",
        default: "I'm not sure I understand that. 🤔 You can ask me about 'skills', 'projects', 'resume', 'contact', or use the quick buttons below!"
    };

    let botGreetingSent = false;

    // Toggle Chat Window
    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('hidden');
            if (!chatbotWindow.classList.contains('hidden') && !botGreetingSent) {
                // Send initial greeting on first open
                sendBotReply(botReplies.greeting);
                botGreetingSent = true;
            }
        });
    }

    if (chatbotClose && chatbotWindow) {
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.add('hidden');
        });
    }

    // Function to append messages
    const appendMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        
        // Convert newlines to breaks and simple bold formatting
        const formattedText = text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
        msgDiv.innerHTML = formattedText;
        chatbotMessages.appendChild(msgDiv);
        
        // Auto-scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    // Send Bot Reply with Typing Animation
    const sendBotReply = (replyText) => {
        // Create typing indicator bubble
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg bot typing-indicator';
        typingDiv.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // Simulate typing delay
        setTimeout(() => {
            // Remove typing indicator
            typingDiv.remove();
            
            // Append actual message
            appendMessage(replyText, 'bot');
        }, 1200);
    };

    // Parse custom user inputs for keywords
    const getBotResponse = (userInput) => {
        const text = userInput.toLowerCase().trim();
        
        if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('yo')) {
            return "Hey there! How can I help you today? 😊";
        }
        if (text.includes('skill') || text.includes('languages') || text.includes('technologies') || text.includes('stack')) {
            return botReplies.skills;
        }
        if (text.includes('project') || text.includes('work') || text.includes('portfolio')) {
            return botReplies.projects;
        }
        if (text.includes('resume') || text.includes('cv') || text.includes('biodata')) {
            return botReplies.resume;
        }
        if (text.includes('contact') || text.includes('email') || text.includes('phone') || text.includes('number') || text.includes('whatsapp') || text.includes('linkedin') || text.includes('instagram') || text.includes('insta')) {
            return botReplies.contact;
        }
        if (text.includes('name') || text.includes('who are you') || text.includes('your name')) {
            return "I am Rushit's Virtual Assistant, built to help you navigate his portfolio site! 🤖";
        }
        if (text.includes('thanks') || text.includes('thank you')) {
            return "You're welcome! Let me know if you need anything else. 👍";
        }
        
        return botReplies.default;
    };

    // Handle Form Submission (User sending message)
    if (chatbotForm && chatbotInput) {
        chatbotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userMsg = chatbotInput.value.trim();
            if (!userMsg) return;

            // 1. Append user message to UI
            appendMessage(userMsg, 'user');
            chatbotInput.value = '';

            // 2. Get bot reply and send it
            const response = getBotResponse(userMsg);
            sendBotReply(response);
        });
    }

    // Handle Suggestion Chips click
    if (chatbotSuggestions) {
        chatbotSuggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('chat-suggest-chip')) {
                const query = e.target.getAttribute('data-query');
                const chipText = e.target.textContent;

                // 1. Append chip selection as user message
                appendMessage(chipText, 'user');

                // 2. Send matching bot reply
                const response = botReplies[query] || botReplies.default;
                sendBotReply(response);
            }
        });
    }
});
