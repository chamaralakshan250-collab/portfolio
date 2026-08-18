document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       MOBILE NAVIGATION
       ========================================== */
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileNav && mobileClose) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.add('open');
        });

        mobileClose.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
            });
        });
    }

    /* ==========================================
       NAVBAR SCROLL HIGHLIGHTING (IntersectionObserver)
       ========================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies main center of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });

                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* ==========================================
       TYPEWRITER ANIMATION
       ========================================== */
    const typewriterElement = document.getElementById('typewriter');
    const words = ["Software Engineer", "Full Stack Developer", "Mobile App Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // normal typing
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    if (typewriterElement) {
        setTimeout(type, 1000); // Initial delay
    }

    /* ==========================================
       SKILLS PROGRESS BAR ANIMATION ON SCROLL
       ========================================== */
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress');

    if (skillsSection && progressBars.length > 0) {
        // Reset initially so they don't load instantly
        progressBars.forEach(bar => {
            // Save actual width from inline style and set to 0
            const targetWidth = bar.style.width;
            bar.setAttribute('data-target-width', targetWidth);
            bar.style.width = '0%';
        });

        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBars.forEach(bar => {
                        const target = bar.getAttribute('data-target-width');
                        bar.style.width = target;
                    });
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, { threshold: 0.15 });

        skillsObserver.observe(skillsSection);
    }

    /* ==========================================
       PROJECTS FILTER
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    // Add fade-out transition
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        if (filterValue === 'all' || category === filterValue) {
                            card.classList.remove('hide');
                            // Triggers reflow
                            void card.offsetWidth; 
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        } else {
                            card.classList.add('hide');
                        }
                    }, 300);
                });
            });
        });
    }

    /* ==========================================
       CONTACT FORM VALIDATION
       ========================================== */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            
            // Input elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            // Reset previous errors
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('error'));
            formFeedback.style.display = 'none';

            // Validate Name
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('error');
                isValid = false;
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                emailInput.parentElement.classList.add('error');
                isValid = false;
            }

            // Validate Subject
            if (!subjectInput.value.trim()) {
                subjectInput.parentElement.classList.add('error');
                isValid = false;
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('error');
                isValid = false;
            }

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnContent = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

                // Send to Web3Forms API
                const formData = new FormData();
                formData.append("access_key", "3067a3e5-f1c6-49cc-82ca-3012930ccd3d"); 
                formData.append("name", nameInput.value.trim());
                formData.append("email", emailInput.value.trim());
                formData.append("subject", subjectInput.value.trim());
                formData.append("message", messageInput.value.trim());

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                })
                .then(async (response) => {
                    const json = await response.json();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;

                    if (response.ok) {
                        // Show Success Feedback
                        formFeedback.className = 'form-feedback success';
                        formFeedback.innerHTML = `<strong>Success!</strong> Thank you, ${nameInput.value.trim()}. Your message has been sent. I will get back to you shortly!`;
                        formFeedback.style.display = 'block';
                        // Clear Inputs
                        contactForm.reset();
                    } else {
                        console.error(json);
                        formFeedback.className = 'form-feedback error';
                        formFeedback.innerHTML = `<strong>Error!</strong> ${json.message || 'Something went wrong. Please try again.'}`;
                        formFeedback.style.display = 'block';
                    }
                })
                .catch((error) => {
                    console.error(error);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    formFeedback.className = 'form-feedback error';
                    formFeedback.innerHTML = '<strong>Error!</strong> Unable to send message. Please check your network connection.';
                    formFeedback.style.display = 'block';
                });
            } else {
                // Show Error Feedback
                formFeedback.className = 'form-feedback error';
                formFeedback.innerHTML = '<strong>Please correct the highlighted fields above before submitting.</strong>';
                formFeedback.style.display = 'block';
            }
        });

        // Interactive validation cleanups on input keyup/change
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.parentElement.classList.remove('error');
                }
            });
        });
    }

    /* ==========================================
       BACKGROUND PARALLAX & SPARKLES ANIMATION
       ========================================== */
    const blobContainer = document.getElementById('blobContainer');
    const orbsContainer = document.querySelector('.floating-orbs-container');
    const sparklesContainer = document.getElementById('sparklesContainer');

    // 1. Generate Sparkles
    if (sparklesContainer) {
        const sparkleCount = 45;
        const colors = ['sparkle-violet', 'sparkle-cyan', 'sparkle-white'];
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            
            // Random color
            const colorClass = colors[Math.floor(Math.random() * colors.length)];
            sparkle.classList.add(colorClass);
            
            // Random sizes (between 1px and 3.5px)
            const size = (Math.random() * 2.5 + 1).toFixed(1);
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            
            // Random horizontal and vertical initial layout
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            
            // Random animation delay and duration
            const delay = (Math.random() * 12).toFixed(1);
            const duration = (Math.random() * 15 + 10).toFixed(1);
            sparkle.style.animationDelay = `${delay}s`;
            sparkle.style.animationDuration = `${duration}s`;
            
            // Random drift x coordinate
            const driftX = Math.floor(Math.random() * 120 - 60);
            sparkle.style.setProperty('--drift-x', `${driftX}px`);
            
            sparklesContainer.appendChild(sparkle);
        }
    }

    // 2. Mouse Parallax with Smooth Lerp
    if (blobContainer && orbsContainer) {
        let lastX = 0;
        let lastY = 0;
        let targetX = 0;
        let targetY = 0;

        window.addEventListener('mousemove', (e) => {
            // Normalize values between -1 and 1 relative to center
            targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        });

        // Handle touch screens or devices without mouse
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null && e.beta !== null) {
                // Normalize gamma (-90 to 90) and beta (-180 to 180)
                targetX = e.gamma / 45;
                targetY = (e.beta - 45) / 45;
                // Clamp between -1 and 1
                targetX = Math.max(-1, Math.min(1, targetX));
                targetY = Math.max(-1, Math.min(1, targetY));
            }
        });

        // Smooth animation frame loop
        function updateParallax() {
            // Linear interpolation (lerp) for smooth easing
            lastX += (targetX - lastX) * 0.08;
            lastY += (targetY - lastY) * 0.08;

            // Parallax displacements (px)
            const bgShiftX = lastX * 18;
            const bgShiftY = lastY * 18;
            const orbsShiftX = -lastX * 32; // opposite direction for 3D parallax depth
            const orbsShiftY = -lastY * 32;

            blobContainer.style.transform = `translate3d(${bgShiftX}px, ${bgShiftY}px, 0)`;
            orbsContainer.style.transform = `translate3d(${orbsShiftX}px, ${orbsShiftY}px, 0)`;

            requestAnimationFrame(updateParallax);
        }
        
        updateParallax();
    }

    // 3. Luxury Custom Cursor Tracking
    const cursorDot = document.getElementById('customCursorDot');
    const cursorOutline = document.getElementById('customCursorOutline');
    const cursorGlow = document.getElementById('customCursorGlow');
    const cursorParticle1 = document.getElementById('customCursorParticle1');
    const cursorParticle2 = document.getElementById('customCursorParticle2');
    const cursorParticle3 = document.getElementById('customCursorParticle3');

    const cursorElements = [
        cursorDot,
        cursorOutline,
        cursorGlow,
        cursorParticle1,
        cursorParticle2,
        cursorParticle3
    ].filter(Boolean);

    if (cursorDot && cursorOutline && cursorGlow && cursorParticle1 && cursorParticle2 && cursorParticle3) {
        let mouseX = 0;
        let mouseY = 0;
        
        let dotX = 0;
        let dotY = 0;
        
        let outlineX = 0;
        let outlineY = 0;
        
        let glowX = 0;
        let glowY = 0;
        
        let p1X = 0;
        let p1Y = 0;
        
        let p2X = 0;
        let p2Y = 0;
        
        let p3X = 0;
        let p3Y = 0;
        
        // Hide elements initially until mouse moves to prevent cursor showing at top-left
        cursorElements.forEach(el => {
            el.style.opacity = '0';
        });
        
        let isMoving = false;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMoving) {
                isMoving = true;
                cursorElements.forEach(el => {
                    el.style.opacity = '1';
                });
                dotX = mouseX;
                dotY = mouseY;
                outlineX = mouseX;
                outlineY = mouseY;
                glowX = mouseX;
                glowY = mouseY;
                p1X = mouseX;
                p1Y = mouseY;
                p2X = mouseX;
                p2Y = mouseY;
                p3X = mouseX;
                p3Y = mouseY;
            }
        });

        // Hide cursor components when the mouse leaves the document window
        document.addEventListener('mouseleave', () => {
            cursorElements.forEach(el => {
                el.style.opacity = '0';
            });
        });
        
        // Re-show when mouse re-enters
        document.addEventListener('mouseenter', () => {
            if (isMoving) {
                cursorElements.forEach(el => {
                    el.style.opacity = '1';
                });
            }
        });

        // Smooth cursor interpolation loop
        function updateCursor() {
            if (isMoving) {
                // Center dot tracks the mouse closely
                dotX += (mouseX - dotX) * 0.35;
                dotY += (mouseY - dotY) * 0.35;
                
                // Outer ring follows with an elegant elastic lag
                outlineX += (mouseX - outlineX) * 0.18;
                outlineY += (mouseY - outlineY) * 0.18;
                
                // Ambient glow floats behind smoothly
                glowX += (mouseX - glowX) * 0.08;
                glowY += (mouseY - glowY) * 0.08;
                
                // Orbiting particles (zero-gravity trail)
                const time = Date.now() * 0.003;
                
                // Particle 1 (Cyan) orbits fast and tight
                const targetP1X = dotX + Math.cos(time * 1.5) * 18;
                const targetP1Y = dotY + Math.sin(time * 1.5) * 18;
                p1X += (targetP1X - p1X) * 0.12;
                p1Y += (targetP1Y - p1Y) * 0.12;
                
                // Particle 2 (Purple) orbits slower and wider
                const targetP2X = dotX + Math.cos(time * 0.9 + Math.PI * 0.6) * 26;
                const targetP2Y = dotY + Math.sin(time * 0.9 + Math.PI * 0.6) * 26;
                p2X += (targetP2X - p2X) * 0.08;
                p2Y += (targetP2Y - p2Y) * 0.08;
                
                // Particle 3 (Pink) orbits at an offset and medium speed
                const targetP3X = dotX + Math.sin(time * 1.2 + Math.PI * 1.2) * 22;
                const targetP3Y = dotY + Math.cos(time * 1.2 + Math.PI * 1.2) * 22;
                p3X += (targetP3X - p3X) * 0.10;
                p3Y += (targetP3Y - p3Y) * 0.10;
                
                // Apply transformations
                cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
                cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;
                cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
                cursorParticle1.style.transform = `translate3d(${p1X}px, ${p1Y}px, 0)`;
                cursorParticle2.style.transform = `translate3d(${p2X}px, ${p2Y}px, 0)`;
                cursorParticle3.style.transform = `translate3d(${p3X}px, ${p3Y}px, 0)`;
            }
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // Hover expansions for all interactive elements (including BusMate card selection)
        const hoverTargets = document.querySelectorAll('a, button, .filter-btn, .social-icon, .project-card, .btn, input, textarea, select, .sim-bus-card, .route-back-arrow, .seats-back-arrow, .sim-btn-clear-all');
        
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursorElements.forEach(el => el.classList.add('active'));
            });
            
            target.addEventListener('mouseleave', () => {
                cursorElements.forEach(el => el.classList.remove('active'));
            });
        });
    }

    /* ==========================================
       BUSMATE INTERACTIVE PORTAL SIMULATOR
       ========================================== */
    const busmateModal = document.getElementById('busmateModal');
    const demoTriggers = document.querySelectorAll('.busmate-demo-trigger');
    const modalClose = document.getElementById('busmateModalClose');
    const modalBackdrop = document.getElementById('busmateModalBackdrop');
    
    // Quick controls
    const ctrlButtons = document.querySelectorAll('.btn-ctrl');
    const simScreens = document.querySelectorAll('.sim-screen');
    
    // Auth Screen elements
    const passwordInput = document.getElementById('simPassword');
    const passwordToggle = document.getElementById('simPasswordToggle');
    const loginBtn = document.getElementById('simBtnLogin');
    
    // Add Bus Screen elements
    const addBusBtn = document.getElementById('simBtnAddBus');
    const inputBusName = document.getElementById('simBusName');
    const inputBusRoute = document.getElementById('simBusRoute');
    const backToLogin = document.getElementById('simBackToLogin');
    
    // Tracking elements
    const backToAddBus = document.getElementById('simBackToAddBus');
    const tooltipBusName = document.getElementById('tooltipBusName');
    const busMarker = document.getElementById('busMarker');
    const mapCanvas = document.getElementById('simMapCanvas');
    const zoomIn = document.getElementById('simZoomIn');
    const zoomOut = document.getElementById('simZoomOut');
    
    let timeInterval;
    let mapZoom = 1.0;
    let busAnimationId = null;
    let busPositionX = 160;
    let busDirection = 1; // 1 = right, -1 = left
    
    // 1. Phone status time update
    function updatePhoneTime() {
        const timeEl = document.getElementById('phoneTime');
        if (!timeEl) return;
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        const formattedHours = String(hours).padStart(2, '0');
        timeEl.textContent = `${formattedHours}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()} ${ampm}`;
    }
    
    // 2. Navigation
    function showSimScreen(screenId) {
        simScreens.forEach(screen => {
            screen.classList.remove('active');
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) targetScreen.classList.add('active');
        
        // Sync quick controls
        ctrlButtons.forEach(btn => {
            btn.classList.remove('active');
            const target = btn.getAttribute('data-target');
            if (screenId === 'simScreenLogin' && target === 'login') btn.classList.add('active');
            if (screenId === 'simScreenAddBus' && target === 'addbus') btn.classList.add('active');
            if (screenId === 'simScreenTracking' && target === 'tracking') btn.classList.add('active');
            if (screenId === 'simScreenBuses' && target === 'buses') btn.classList.add('active');
            if (screenId === 'simScreenSeats' && target === 'seats') btn.classList.add('active');
            if (screenId === 'simScreenStatus' && target === 'status') btn.classList.add('active');
        });
        
        // Handle bus animation loop based on screen state
        if (screenId === 'simScreenTracking') {
            startBusAnimation();
        } else {
            stopBusAnimation();
        }
    }
    
    // Quick control button clicks
    ctrlButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            if (target === 'login') showSimScreen('simScreenLogin');
            if (target === 'addbus') showSimScreen('simScreenAddBus');
            if (target === 'tracking') showSimScreen('simScreenTracking');
            if (target === 'buses') showSimScreen('simScreenBuses');
            if (target === 'seats') showSimScreen('simScreenSeats');
            if (target === 'status') showSimScreen('simScreenStatus');
        });
    });

    // Available Buses navigation
    const simBusesBack = document.getElementById('simBusesBack');
    const simBusesSubBack = document.getElementById('simBusesSubBack');
    const busCards = document.querySelectorAll('.sim-bus-card');

    if (simBusesBack) simBusesBack.addEventListener('click', () => showSimScreen('simScreenAddBus'));
    if (simBusesSubBack) simBusesSubBack.addEventListener('click', () => showSimScreen('simScreenAddBus'));
    
    busCards.forEach(card => {
        card.addEventListener('click', () => {
            showSimScreen('simScreenSeats');
        });
    });

    // Choose Seats navigation
    const simSeatsBack = document.getElementById('simSeatsBack');
    const simSeatsSubBack = document.getElementById('simSeatsSubBack');
    if (simSeatsBack) simSeatsBack.addEventListener('click', () => showSimScreen('simScreenBuses'));
    if (simSeatsSubBack) simSeatsSubBack.addEventListener('click', () => showSimScreen('simScreenBuses'));

    // Seat Status tabs navigation
    const simTabHome = document.getElementById('simTabHome');
    const simTabStatus = document.getElementById('simTabStatus');
    const simTabLogout = document.getElementById('simTabLogout');

    if (simTabHome) simTabHome.addEventListener('click', () => showSimScreen('simScreenBuses'));
    if (simTabStatus) simTabStatus.addEventListener('click', () => showSimScreen('simScreenStatus'));
    if (simTabLogout) simTabLogout.addEventListener('click', () => showSimScreen('simScreenLogin'));

    // Dynamic Seat Grids state & generation
    let selectedSeats = [];
    let bookedSeats = [2, 3]; // initial booked seats matching mockup 3

    function generateSeatGrids() {
        const seatGrid = document.getElementById('simSeatGrid');
        const statusGrid = document.getElementById('simStatusGrid');
        if (!seatGrid || !statusGrid) return;
        
        seatGrid.innerHTML = '';
        statusGrid.innerHTML = '';
        
        // 1. Generate Selection Grid: 35 seats, 2+3 layout
        // columns: Col 1, Col 2, Spacer, Col 3, Col 4, Col 5
        // 7 rows total
        for (let r = 0; r < 7; r++) {
            for (let c = 1; c <= 6; c++) {
                if (c === 3) {
                    const spacer = document.createElement('div');
                    spacer.classList.add('sim-aisle-spacer');
                    seatGrid.appendChild(spacer);
                } else {
                    const colIndex = c > 3 ? c - 1 : c;
                    const seatId = r * 5 + colIndex;
                    
                    const selectBtn = document.createElement('button');
                    selectBtn.classList.add('sim-seat-btn');
                    selectBtn.setAttribute('data-seat-id', seatId);
                    selectBtn.textContent = seatId;
                    
                    // Mark as booked if in bookedSeats
                    if (bookedSeats.includes(seatId)) {
                        selectBtn.classList.add('booked');
                    }
                    
                    selectBtn.addEventListener('click', () => handleSeatSelect(selectBtn, seatId));
                    seatGrid.appendChild(selectBtn);
                }
            }
        }
        
        // 2. Generate Status Grid: 36 seats, 2+2 layout
        // columns: Col 1, Col 2, Spacer, Col 3, Col 4
        // 9 rows total
        for (let r = 0; r < 9; r++) {
            for (let c = 1; c <= 5; c++) {
                if (c === 3) {
                    const spacer = document.createElement('div');
                    spacer.classList.add('sim-aisle-spacer');
                    statusGrid.appendChild(spacer);
                } else {
                    const colIndex = c > 3 ? c - 1 : c;
                    const seatId = r * 4 + colIndex;
                    
                    const statusBox = document.createElement('div');
                    statusBox.classList.add('sim-status-box');
                    statusBox.setAttribute('data-seat-id', seatId);
                    statusBox.textContent = seatId;
                    
                    // Mark as booked if in bookedSeats
                    if (bookedSeats.includes(seatId)) {
                        statusBox.classList.add('booked');
                    }
                    
                    statusGrid.appendChild(statusBox);
                }
            }
        }
        
        updateSeatCounterDisplay();
    }

    function handleSeatSelect(btn, seatId) {
        if (bookedSeats.includes(seatId)) return;
        
        if (selectedSeats.includes(seatId)) {
            selectedSeats = selectedSeats.filter(id => id !== seatId);
            btn.classList.remove('selected');
        } else {
            selectedSeats.push(seatId);
            btn.classList.add('selected');
        }
        
        updateSeatCounterDisplay();
    }

    function updateSeatCounterDisplay() {
        const countDisplay = document.getElementById('simSeatsSelectedCount');
        const priceDisplay = document.getElementById('simSeatsTotalPrice');
        const continueBtn = document.getElementById('simSeatsBtnContinue');
        
        if (countDisplay) countDisplay.textContent = `${selectedSeats.length} Seat(s)`;
        
        const totalPrice = selectedSeats.length * 1270;
        if (priceDisplay) priceDisplay.textContent = `LKR ${totalPrice}`;
        
        if (continueBtn) {
            continueBtn.disabled = selectedSeats.length === 0;
        }
    }

    // Continue checkout booking flow
    const simSeatsBtnContinue = document.getElementById('simSeatsBtnContinue');
    if (simSeatsBtnContinue) {
        simSeatsBtnContinue.addEventListener('click', () => {
            if (selectedSeats.length === 0) return;
            
            const originalText = simSeatsBtnContinue.innerHTML;
            simSeatsBtnContinue.disabled = true;
            simSeatsBtnContinue.innerHTML = '<span>Booking...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
            
            setTimeout(() => {
                // Book selected seats
                selectedSeats.forEach(seatId => {
                    if (!bookedSeats.includes(seatId)) {
                        bookedSeats.push(seatId);
                    }
                });
                
                // Reset Selection variables
                selectedSeats = [];
                
                // Re-generate grid elements with updated bookings
                generateSeatGrids();
                
                // Navigate to Seat Status Screen
                showSimScreen('simScreenStatus');
                
                // Reset continue button markup
                simSeatsBtnContinue.disabled = false;
                simSeatsBtnContinue.innerHTML = originalText;
            }, 1200);
        });
    }

    // Clear All bookings click handler
    const simStatusBtnClearAll = document.getElementById('simStatusBtnClearAll');
    if (simStatusBtnClearAll) {
        simStatusBtnClearAll.addEventListener('click', () => {
            bookedSeats = [];
            selectedSeats = [];
            generateSeatGrids();
        });
    }

    // Generate grids on startup
    generateSeatGrids();
    
    // 3. Modal Opening / Closing
    function openModal() {
        if (busmateModal) {
            busmateModal.classList.add('active');
            busmateModal.setAttribute('aria-hidden', 'false');
            updatePhoneTime();
            timeInterval = setInterval(updatePhoneTime, 10000);
            
            // Trigger dynamic cursor hover classes updates for new interactive elements
            const newHoverElements = busmateModal.querySelectorAll('input, button, select, a, .sim-password-toggle, .sim-bus-card, .route-back-arrow, .seats-back-arrow, .sim-btn-clear-all');
            const modalCursorElements = [
                document.getElementById('customCursorDot'),
                document.getElementById('customCursorOutline'),
                document.getElementById('customCursorGlow'),
                document.getElementById('customCursorParticle1'),
                document.getElementById('customCursorParticle2'),
                document.getElementById('customCursorParticle3')
            ].filter(Boolean);
            
            if (modalCursorElements.length > 0) {
                newHoverElements.forEach(target => {
                    target.addEventListener('mouseenter', () => {
                        modalCursorElements.forEach(el => el.classList.add('active'));
                    });
                    
                    target.addEventListener('mouseleave', () => {
                        modalCursorElements.forEach(el => el.classList.remove('active'));
                    });
                });
            }
        }
    }
    
    function closeModal() {
        if (busmateModal) {
            busmateModal.classList.remove('active');
            busmateModal.setAttribute('aria-hidden', 'true');
            clearInterval(timeInterval);
            stopBusAnimation();
        }
    }
    
    demoTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    
    window.addEventListener('keydown', (e) => {
        if (busmateModal && e.key === 'Escape' && busmateModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // 4. Password Toggle
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = passwordToggle.querySelector('i');
            if (type === 'text') {
                icon.className = 'fa-solid fa-eye';
            } else {
                icon.className = 'fa-solid fa-eye-slash';
            }
        });
    }
    
    // 5. Driver Login Simulation
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalBtnHtml = loginBtn.innerHTML;
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span>Authenticating...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
            
            setTimeout(() => {
                loginBtn.disabled = false;
                loginBtn.innerHTML = originalBtnHtml;
                showSimScreen('simScreenAddBus');
            }, 1200);
        });
    }
    
    // 6. Navigation items
    if (backToLogin) backToLogin.addEventListener('click', () => showSimScreen('simScreenLogin'));
    if (backToAddBus) backToAddBus.addEventListener('click', () => showSimScreen('simScreenAddBus'));
    
    // 7. Add Bus & Start tracking
    if (addBusBtn) {
        addBusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Sync values
            const busName = inputBusName.value.trim() || 'Nirosha Express';
            if (tooltipBusName) tooltipBusName.textContent = busName + ' - Live Location';
            
            // Simulate brief submit spinner
            const originalText = addBusBtn.innerHTML;
            addBusBtn.disabled = true;
            addBusBtn.innerHTML = '<span>Saving details...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
            
            setTimeout(() => {
                addBusBtn.disabled = false;
                addBusBtn.innerHTML = originalText;
                showSimScreen('simScreenTracking');
            }, 800);
        });
    }
    
    // 8. Map Zoom controls
    if (zoomIn && zoomOut && mapCanvas) {
        const mapSvg = mapCanvas.querySelector('.sim-map-svg');
        zoomIn.addEventListener('click', () => {
            if (mapZoom < 1.6) {
                mapZoom += 0.15;
                mapSvg.style.transform = `scale(${mapZoom})`;
            }
        });
        
        zoomOut.addEventListener('click', () => {
            if (mapZoom > 0.85) {
                mapZoom -= 0.15;
                mapSvg.style.transform = `scale(${mapZoom})`;
            }
        });
    }
    
    // 9. Bus Movement Vector Animation
    function animateBus() {
        // Move horizontal along Y=200
        busPositionX += 0.5 * busDirection;
        
        // Turn around
        if (busPositionX >= 270) {
            busDirection = -1;
        } else if (busPositionX <= 50) {
            busDirection = 1;
        }
        
        // Update SVG group translate
        if (busMarker) {
            busMarker.setAttribute('transform', `translate(${busPositionX.toFixed(1)}, 200)`);
        }
        
        busAnimationId = requestAnimationFrame(animateBus);
    }
    
    function startBusAnimation() {
        if (!busAnimationId) {
            animateBus();
        }
    }
    
    function stopBusAnimation() {
        if (busAnimationId) {
            cancelAnimationFrame(busAnimationId);
            busAnimationId = null;
        }
    }

    // ==========================================
    // THEME SWITCHER LOGIC
    // ==========================================
    const themeSwitcher = document.getElementById('themeSwitcher');
    const themeSwitcherToggle = document.getElementById('themeSwitcherToggle');
    const themeOptions = document.querySelectorAll('.theme-option');

    if (themeSwitcherToggle && themeSwitcher) {
        // Toggle Panel Open/Close
        themeSwitcherToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            themeSwitcher.classList.toggle('active');
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!themeSwitcher.contains(e.target)) {
                themeSwitcher.classList.remove('active');
            }
        });

        // Handle Theme selection
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                
                // Remove existing themes from body
                document.body.classList.remove('theme-amber', 'theme-violet', 'theme-blue', 'theme-rose', 'theme-green', 'theme-ocean');
                
                // Add selected theme
                document.body.classList.add(`theme-${theme}`);
                
                // Update active state of button
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Save theme to localStorage
                localStorage.setItem('portfolio-theme', theme);
            });
        });

        // Load saved theme on load
        const savedTheme = localStorage.getItem('portfolio-theme') || 'ocean';
        const activeOption = document.querySelector(`.theme-option[data-theme="${savedTheme}"]`);
        if (activeOption) {
            activeOption.click();
        }
    }

    /* ==========================================
       ASSIGNMENT SYSTEM INTERACTIVE PORTAL SIMULATOR
       ========================================== */
    const assignModal = document.getElementById('assignmentModal');
    const assignTriggers = document.querySelectorAll('.assignment-demo-trigger');
    const assignClose = document.getElementById('assignmentModalClose');
    const assignBackdrop = document.getElementById('assignmentModalBackdrop');
    
    // Roles & Screen Controls
    const btnRoleStudent = document.getElementById('btnRoleStudent');
    const btnRoleLecturer = document.getElementById('btnRoleLecturer');
    const assignEmail = document.getElementById('assignEmail');
    const assignPassword = document.getElementById('assignPassword');
    const assignBtnLogin = document.getElementById('assignBtnLogin');
    
    const assignScreenLogin = document.getElementById('assignScreenLogin');
    const assignScreenStudent = document.getElementById('assignScreenStudent');
    const assignScreenLecturer = document.getElementById('assignScreenLecturer');
    
    const browserAddressText = document.getElementById('browserAddressText');
    
    // Student screen elements
    const uploadArea = document.getElementById('uploadArea');
    const btnBrowseFile = document.getElementById('btnBrowseFile');
    const uploadedFileInfo = document.getElementById('uploadedFileInfo');
    const uploadFilename = document.getElementById('uploadFilename');
    const btnRemoveFile = document.getElementById('btnRemoveFile');
    const assignBtnSubmit = document.getElementById('assignBtnSubmit');
    const submitSuccessState = document.getElementById('submitSuccessState');
    const uploadText = document.getElementById('uploadText');
    const uploadOr = document.getElementById('uploadOr');
    
    // Lecturer screen elements
    const gradingDocName = document.getElementById('gradingDocName');
    const gradingForm = document.getElementById('gradingForm');
    const assignBtnGrade = document.getElementById('assignBtnGrade');
    const gradingSuccessState = document.getElementById('gradingSuccessState');
    const savedGradeDisplay = document.getElementById('savedGradeDisplay');
    const gradeInput = document.getElementById('gradeInput');
    const feedbackInput = document.getElementById('feedbackInput');
    
    // Logouts
    const assignStudentLogout = document.getElementById('assignStudentLogout');
    const assignLecturerLogout = document.getElementById('assignLecturerLogout');
    
    // Quick Controls Jump Buttons
    const btnCtrlAssignLogin = document.getElementById('btnCtrlAssignLogin');
    const btnCtrlAssignStudent = document.getElementById('btnCtrlAssignStudent');
    const btnCtrlAssignLecturer = document.getElementById('btnCtrlAssignLecturer');
    const ctrlAssignButtons = document.querySelectorAll('.btn-ctrl-assign');
    
    let activeRole = 'student'; // default
    let submittedFile = null;   // dynamic submission state
    
    function openAssignModal() {
        if (assignModal) {
            assignModal.classList.add('active');
            assignModal.setAttribute('aria-hidden', 'false');
            
            // Reset state
            activeRole = 'student';
            submittedFile = null;
            if (btnRoleStudent) btnRoleStudent.click();
            resetUploadState();
            if (gradingForm) gradingForm.style.display = 'block';
            if (gradingSuccessState) gradingSuccessState.style.display = 'none';
            showAssignScreen('login');
            
            // Trigger custom cursor dynamic hover classes updates for new elements in assignment modal
            const newHoverElements = assignModal.querySelectorAll('input, button, select, textarea, a, .role-btn, .btn-remove-file');
            const modalCursorElements = [
                document.getElementById('customCursorDot'),
                document.getElementById('customCursorOutline'),
                document.getElementById('customCursorGlow')
            ].filter(Boolean);
            
            if (modalCursorElements.length > 0) {
                newHoverElements.forEach(target => {
                    target.addEventListener('mouseenter', () => {
                        modalCursorElements.forEach(el => el.classList.add('active'));
                    });
                    
                    target.addEventListener('mouseleave', () => {
                        modalCursorElements.forEach(el => el.classList.remove('active'));
                    });
                });
            }
        }
    }
    
    function closeAssignModal() {
        if (assignModal) {
            assignModal.classList.remove('active');
            assignModal.setAttribute('aria-hidden', 'true');
        }
    }
    
    assignTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openAssignModal();
        });
    });
    
    if (assignClose) assignClose.addEventListener('click', closeAssignModal);
    if (assignBackdrop) assignBackdrop.addEventListener('click', closeAssignModal);
    
    window.addEventListener('keydown', (e) => {
        if (assignModal && e.key === 'Escape' && assignModal.classList.contains('active')) {
            closeAssignModal();
        }
    });
    
    // Switch Role in Login
    if (btnRoleStudent && btnRoleLecturer) {
        btnRoleStudent.addEventListener('click', () => {
            activeRole = 'student';
            btnRoleStudent.classList.add('active');
            btnRoleLecturer.classList.remove('active');
            assignEmail.value = 'student.saman@vau.ac.lk';
            assignPassword.value = '••••••••';
        });
        
        btnRoleLecturer.addEventListener('click', () => {
            activeRole = 'lecturer';
            btnRoleLecturer.classList.add('active');
            btnRoleStudent.classList.remove('active');
            assignEmail.value = 'lecturer.perera@vau.ac.lk';
            assignPassword.value = '••••••••';
        });
    }
    
    // Screen transition helper
    function showAssignScreen(screenId) {
        assignScreenLogin.classList.remove('active');
        assignScreenStudent.classList.remove('active');
        assignScreenLecturer.classList.remove('active');
        
        ctrlAssignButtons.forEach(btn => btn.classList.remove('active'));
        
        if (screenId === 'login') {
            assignScreenLogin.classList.add('active');
            browserAddressText.textContent = 'vau-portal.lk/login';
            if (btnCtrlAssignLogin) btnCtrlAssignLogin.classList.add('active');
        } else if (screenId === 'student') {
            assignScreenStudent.classList.add('active');
            browserAddressText.textContent = 'vau-portal.lk/student/dashboard';
            if (btnCtrlAssignStudent) btnCtrlAssignStudent.classList.add('active');
        } else if (screenId === 'lecturer') {
            assignScreenLecturer.classList.add('active');
            browserAddressText.textContent = 'vau-portal.lk/lecturer/evaluate';
            if (btnCtrlAssignLecturer) btnCtrlAssignLecturer.classList.add('active');
        }
    }
    
    // Login Submission
    if (assignBtnLogin) {
        assignBtnLogin.addEventListener('click', () => {
            // Animate button slightly
            assignBtnLogin.style.transform = 'scale(0.95)';
            setTimeout(() => {
                assignBtnLogin.style.transform = '';
                showAssignScreen(activeRole);
            }, 300);
        });
    }
    
    // Logouts
    if (assignStudentLogout) {
        assignStudentLogout.addEventListener('click', () => showAssignScreen('login'));
    }
    if (assignLecturerLogout) {
        assignLecturerLogout.addEventListener('click', () => showAssignScreen('login'));
    }
    
    // Jump Controls
    if (btnCtrlAssignLogin) {
        btnCtrlAssignLogin.addEventListener('click', () => showAssignScreen('login'));
    }
    if (btnCtrlAssignStudent) {
        btnCtrlAssignStudent.addEventListener('click', () => showAssignScreen('student'));
    }
    if (btnCtrlAssignLecturer) {
        btnCtrlAssignLecturer.addEventListener('click', () => showAssignScreen('lecturer'));
    }
    
    // Student Upload & Submit Flow
    function resetUploadState() {
        uploadedFileInfo.style.display = 'none';
        uploadText.style.display = 'block';
        uploadOr.style.display = 'block';
        btnBrowseFile.style.display = 'block';
        assignBtnSubmit.classList.add('disabled');
        assignBtnSubmit.style.opacity = '0.5';
        assignBtnSubmit.style.pointerEvents = 'none';
        assignBtnSubmit.style.display = 'flex';
        submitSuccessState.style.display = 'none';
    }
    
    if (btnBrowseFile) {
        btnBrowseFile.addEventListener('click', () => {
            // Simulate selecting a file
            submittedFile = 'assignment_v4_final.pdf';
            uploadFilename.textContent = submittedFile;
            
            // Show file info, hide default upload prompts
            uploadText.style.display = 'none';
            uploadOr.style.display = 'none';
            btnBrowseFile.style.display = 'none';
            uploadedFileInfo.style.display = 'flex';
            
            // Enable submit button
            assignBtnSubmit.classList.remove('disabled');
            assignBtnSubmit.style.opacity = '1';
            assignBtnSubmit.style.pointerEvents = 'auto';
            
            // Sync with Lecturer screen
            if (gradingDocName) gradingDocName.textContent = submittedFile;
        });
    }
    
    if (btnRemoveFile) {
        btnRemoveFile.addEventListener('click', (e) => {
            e.stopPropagation();
            submittedFile = null;
            resetUploadState();
        });
    }
    
    if (assignBtnSubmit) {
        assignBtnSubmit.addEventListener('click', () => {
            // Show loading state
            assignBtnSubmit.querySelector('span').textContent = 'Uploading...';
            assignBtnSubmit.style.opacity = '0.7';
            assignBtnSubmit.style.pointerEvents = 'none';
            
            setTimeout(() => {
                // Done uploading
                assignBtnSubmit.style.display = 'none';
                submitSuccessState.style.display = 'flex';
                assignBtnSubmit.querySelector('span').textContent = 'Submit Assignment';
            }, 1000);
        });
    }
    
    // Lecturer Grading Flow
    if (assignBtnGrade) {
        assignBtnGrade.addEventListener('click', () => {
            const grade = gradeInput.value || '88';
            savedGradeDisplay.textContent = grade + '/100';
            
            // Animate grading
            assignBtnGrade.style.opacity = '0.7';
            assignBtnGrade.style.pointerEvents = 'none';
            
            setTimeout(() => {
                gradingForm.style.display = 'none';
                gradingSuccessState.style.display = 'flex';
                assignBtnGrade.style.opacity = '1';
                assignBtnGrade.style.pointerEvents = 'auto';
            }, 800);
        });
    }

    /* ==========================================
       GEMMATE MOBILE APP INTERACTIVE SIMULATOR
       ========================================== */
    const gemmateModal = document.getElementById('gemmateModal');
    const gemmateTriggers = document.querySelectorAll('.gemmate-demo-trigger');
    const gemmateClose = document.getElementById('gemmateModalClose');
    const gemmateBackdrop = document.getElementById('gemmateModalBackdrop');
    
    // Screens
    const gemmateScreenLogin = document.getElementById('gemmateScreenLogin');
    const gemmateScreenMarket = document.getElementById('gemmateScreenMarket');
    const gemmateScreenVerify = document.getElementById('gemmateScreenVerify');
    
    // Login Elements
    const gemmateBtnLogin = document.getElementById('gemmateBtnLogin');
    const gemmatePassword = document.getElementById('gemmatePassword');
    const gemmatePasswordToggle = document.getElementById('gemmatePasswordToggle');
    
    // Navigation / Tabs
    const gemTabMarket = document.getElementById('gemTabMarket');
    const gemTabVerify = document.getElementById('gemTabVerify');
    const gemTabMarket2 = document.getElementById('gemTabMarket2');
    const gemTabVerify2 = document.getElementById('gemTabVerify2');
    const verifyBackToMarket = document.getElementById('verifyBackToMarket');
    
    // Verification Panel Elements
    const verifyInputPanel = document.getElementById('verifyInputPanel');
    const verifyLoadingPanel = document.getElementById('verifyLoadingPanel');
    const verifyResultPanel = document.getElementById('verifyResultPanel');
    const gemCertIdInput = document.getElementById('gemCertIdInput');
    const btnVerifyCert = document.getElementById('btnVerifyCert');
    const btnResetVerify = document.getElementById('btnResetVerify');
    const resGemType = document.getElementById('resGemType');
    const resGemWeight = document.getElementById('resGemWeight');
    const gemCardBlueSapphire = document.getElementById('gemCardBlueSapphire');
    const gemCardRuby = document.getElementById('gemCardRuby');
    
    // Quick Controls
    const btnCtrlGemLogin = document.getElementById('btnCtrlGemLogin');
    const btnCtrlGemMarket = document.getElementById('btnCtrlGemMarket');
    const btnCtrlGemVerify = document.getElementById('btnCtrlGemVerify');
    const ctrlGemButtons = document.querySelectorAll('.btn-ctrl-gem');
    
    let gemmateTimeInterval;
    
    function updateGemmatePhoneTime() {
        const timeEl = document.getElementById('gemmatePhoneTime');
        if (timeEl) {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            timeEl.textContent = `${hours}:${minutes} ${ampm}`;
        }
    }
    
    function showGemmateScreen(screenId) {
        gemmateScreenLogin.classList.remove('active');
        gemmateScreenMarket.classList.remove('active');
        gemmateScreenVerify.classList.remove('active');
        
        ctrlGemButtons.forEach(btn => btn.classList.remove('active'));
        
        if (screenId === 'login') {
            gemmateScreenLogin.classList.add('active');
            if (btnCtrlGemLogin) btnCtrlGemLogin.classList.add('active');
        } else if (screenId === 'market') {
            gemmateScreenMarket.classList.add('active');
            if (btnCtrlGemMarket) btnCtrlGemMarket.classList.add('active');
        } else if (screenId === 'verify') {
            gemmateScreenVerify.classList.add('active');
            if (btnCtrlGemVerify) btnCtrlGemVerify.classList.add('active');
        }
    }
    
    function openGemmateModal() {
        if (gemmateModal) {
            gemmateModal.classList.add('active');
            gemmateModal.setAttribute('aria-hidden', 'false');
            updateGemmatePhoneTime();
            gemmateTimeInterval = setInterval(updateGemmatePhoneTime, 10000);
            
            // Reset state
            showGemmateScreen('login');
            verifyInputPanel.style.display = 'block';
            verifyLoadingPanel.style.display = 'none';
            verifyResultPanel.style.display = 'none';
            
            // Bind custom cursors
            const newHoverElements = gemmateModal.querySelectorAll('input, button, select, a, .gemmate-gem-card, .bottom-item');
            const modalCursorElements = [
                document.getElementById('customCursorDot'),
                document.getElementById('customCursorOutline'),
                document.getElementById('customCursorGlow')
            ].filter(Boolean);
            
            if (modalCursorElements.length > 0) {
                newHoverElements.forEach(target => {
                    target.addEventListener('mouseenter', () => {
                        modalCursorElements.forEach(el => el.classList.add('active'));
                    });
                    
                    target.addEventListener('mouseleave', () => {
                        modalCursorElements.forEach(el => el.classList.remove('active'));
                    });
                });
            }
        }
    }
    
    function closeGemmateModal() {
        if (gemmateModal) {
            gemmateModal.classList.remove('active');
            gemmateModal.setAttribute('aria-hidden', 'true');
            clearInterval(gemmateTimeInterval);
        }
    }
    
    gemmateTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openGemmateModal();
        });
    });
    
    if (gemmateClose) gemmateClose.addEventListener('click', closeGemmateModal);
    if (gemmateBackdrop) gemmateBackdrop.addEventListener('click', closeGemmateModal);
    
    window.addEventListener('keydown', (e) => {
        if (gemmateModal && e.key === 'Escape' && gemmateModal.classList.contains('active')) {
            closeGemmateModal();
        }
    });
    
    // Login Click
    if (gemmateBtnLogin) {
        gemmateBtnLogin.addEventListener('click', () => {
            gemmateBtnLogin.style.opacity = '0.8';
            setTimeout(() => {
                gemmateBtnLogin.style.opacity = '1';
                showGemmateScreen('market');
            }, 300);
        });
    }
    
    // Password visibility toggle
    if (gemmatePasswordToggle && gemmatePassword) {
        gemmatePasswordToggle.addEventListener('click', () => {
            const icon = gemmatePasswordToggle.querySelector('i');
            if (gemmatePassword.type === 'password') {
                gemmatePassword.type = 'text';
                icon.className = 'fa-solid fa-eye';
            } else {
                gemmatePassword.type = 'password';
                icon.className = 'fa-solid fa-eye-slash';
            }
        });
    }
    
    // Bottom Navbar actions
    if (gemTabVerify) gemTabVerify.addEventListener('click', () => showGemmateScreen('verify'));
    if (gemTabMarket) gemTabMarket.addEventListener('click', () => showGemmateScreen('market'));
    if (gemTabVerify2) gemTabVerify2.addEventListener('click', () => showGemmateScreen('verify'));
    if (gemTabMarket2) gemTabMarket2.addEventListener('click', () => showGemmateScreen('market'));
    if (verifyBackToMarket) verifyBackToMarket.addEventListener('click', () => showGemmateScreen('market'));
    
    // Marketplace gemstone card clicks
    if (gemCardBlueSapphire) {
        gemCardBlueSapphire.addEventListener('click', () => {
            gemCertIdInput.value = 'GM-9843-BL';
            showGemmateScreen('verify');
        });
    }
    if (gemCardRuby) {
        gemCardRuby.addEventListener('click', () => {
            gemCertIdInput.value = 'GM-4421-RB';
            showGemmateScreen('verify');
        });
    }
    
    // Certificate Verification Flow
    if (btnVerifyCert) {
        btnVerifyCert.addEventListener('click', () => {
            verifyInputPanel.style.display = 'none';
            verifyLoadingPanel.style.display = 'flex';
            
            const certId = gemCertIdInput.value.toUpperCase();
            if (certId.includes('RB') || certId.includes('RUBY')) {
                resGemType.textContent = 'Natural Ruby (Corundum)';
                resGemWeight.textContent = '1.80 carats';
            } else {
                resGemType.textContent = 'Natural Blue Sapphire';
                resGemWeight.textContent = '2.45 carats';
            }
            
            setTimeout(() => {
                verifyLoadingPanel.style.display = 'none';
                verifyResultPanel.style.display = 'block';
            }, 1200);
        });
    }
    
    if (btnResetVerify) {
        btnResetVerify.addEventListener('click', () => {
            verifyResultPanel.style.display = 'none';
            verifyInputPanel.style.display = 'block';
        });
    }
    
    // Jump buttons
    if (btnCtrlGemLogin) btnCtrlGemLogin.addEventListener('click', () => showGemmateScreen('login'));
    if (btnCtrlGemMarket) btnCtrlGemMarket.addEventListener('click', () => showGemmateScreen('market'));
    if (btnCtrlGemVerify) btnCtrlGemVerify.addEventListener('click', () => showGemmateScreen('verify'));


    /* ==========================================
       HOSPITAL MANAGEMENT SYSTEM SIMULATOR
       ========================================== */
    const hospitalModal = document.getElementById('hospitalModal');
    const hospitalTriggers = document.querySelectorAll('.hospital-demo-trigger');
    const hospitalClose = document.getElementById('hospitalModalClose');
    const hospitalBackdrop = document.getElementById('hospitalModalBackdrop');
    
    // Screens
    const hospScreenLogin = document.getElementById('hospScreenLogin');
    const hospScreenReception = document.getElementById('hospScreenReception');
    const hospScreenDoctor = document.getElementById('hospScreenDoctor');
    const hospAddressText = document.getElementById('hospAddressText');
    
    // Form fields
    const hospEmail = document.getElementById('hospEmail');
    const hospPassword = document.getElementById('hospPassword');
    const hospBtnLogin = document.getElementById('hospBtnLogin');
    const btnHospRoleReceptionist = document.getElementById('btnHospRoleReceptionist');
    const btnHospRoleDoctor = document.getElementById('btnHospRoleDoctor');
    
    // Receptionist details
    const hospPatientName = document.getElementById('hospPatientName');
    const hospPatientAge = document.getElementById('hospPatientAge');
    const hospSelectDoctor = document.getElementById('hospSelectDoctor');
    const btnHospRegister = document.getElementById('btnHospRegister');
    const hospBookingForm = document.getElementById('hospBookingForm');
    const hospBookingSuccess = document.getElementById('hospBookingSuccess');
    
    // Success values
    const valBookingPatientName = document.getElementById('valBookingPatientName');
    const valBookingPatientAge = document.getElementById('valBookingPatientAge');
    const valBookingDoctor = document.getElementById('valBookingDoctor');
    
    // Doctor details
    const gradingPatientName = document.getElementById('gradingPatientName');
    const hospDiagnosis = document.getElementById('hospDiagnosis');
    const hospPrescription = document.getElementById('hospPrescription');
    const btnHospSubmitConsultation = document.getElementById('btnHospSubmitConsultation');
    const hospDoctorForm = document.getElementById('hospDoctorForm');
    const hospConsultationSuccess = document.getElementById('hospConsultationSuccess');
    const hospBillPatient = document.getElementById('hospBillPatient');
    
    // Logouts
    const hospReceptionLogout = document.getElementById('hospReceptionLogout');
    const hospDoctorLogout = document.getElementById('hospDoctorLogout');
    
    // Quick Controls Jump Buttons
    const btnCtrlHospLogin = document.getElementById('btnCtrlHospLogin');
    const btnCtrlHospReception = document.getElementById('btnCtrlHospReception');
    const btnCtrlHospDoctor = document.getElementById('btnCtrlHospDoctor');
    const ctrlHospButtons = document.querySelectorAll('.btn-ctrl-hosp');
    
    let hospActiveRole = 'reception'; // default receptionist
    
    function showHospScreen(screenId) {
        hospScreenLogin.classList.remove('active');
        hospScreenReception.classList.remove('active');
        hospScreenDoctor.classList.remove('active');
        
        ctrlHospButtons.forEach(btn => btn.classList.remove('active'));
        
        if (screenId === 'login') {
            hospScreenLogin.classList.add('active');
            hospAddressText.textContent = 'lifecare-hospital.lk/portal';
            if (btnCtrlHospLogin) btnCtrlHospLogin.classList.add('active');
        } else if (screenId === 'reception') {
            hospScreenReception.classList.add('active');
            hospAddressText.textContent = 'lifecare-hospital.lk/reception/dashboard';
            if (btnCtrlHospReception) btnCtrlHospReception.classList.add('active');
        } else if (screenId === 'doctor') {
            hospScreenDoctor.classList.add('active');
            hospAddressText.textContent = 'lifecare-hospital.lk/doctor/consultations';
            if (btnCtrlHospDoctor) btnCtrlHospDoctor.classList.add('active');
        }
    }
    
    function openHospitalModal() {
        if (hospitalModal) {
            hospitalModal.classList.add('active');
            hospitalModal.setAttribute('aria-hidden', 'false');
            
            // Reset forms & roles
            hospActiveRole = 'reception';
            if (btnHospRoleReceptionist) btnHospRoleReceptionist.click();
            hospBookingForm.style.display = 'block';
            hospBookingSuccess.style.display = 'none';
            hospDoctorForm.style.display = 'block';
            hospConsultationSuccess.style.display = 'none';
            showHospScreen('login');
            
            // Custom cursor mouse handlers
            const newHoverElements = hospitalModal.querySelectorAll('input, button, select, textarea, a, .hosp-role-btn');
            const modalCursorElements = [
                document.getElementById('customCursorDot'),
                document.getElementById('customCursorOutline'),
                document.getElementById('customCursorGlow')
            ].filter(Boolean);
            
            if (modalCursorElements.length > 0) {
                newHoverElements.forEach(target => {
                    target.addEventListener('mouseenter', () => {
                        modalCursorElements.forEach(el => el.classList.add('active'));
                    });
                    
                    target.addEventListener('mouseleave', () => {
                        modalCursorElements.forEach(el => el.classList.remove('active'));
                    });
                });
            }
        }
    }
    
    function closeHospitalModal() {
        if (hospitalModal) {
            hospitalModal.classList.remove('active');
            hospitalModal.setAttribute('aria-hidden', 'true');
        }
    }
    
    hospitalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openHospitalModal();
        });
    });
    
    if (hospitalClose) hospitalClose.addEventListener('click', closeHospitalModal);
    if (hospitalBackdrop) hospitalBackdrop.addEventListener('click', closeHospitalModal);
    
    window.addEventListener('keydown', (e) => {
        if (hospitalModal && e.key === 'Escape' && hospitalModal.classList.contains('active')) {
            closeHospitalModal();
        }
    });
    
    // Role selection in login
    if (btnHospRoleReceptionist && btnHospRoleDoctor) {
        btnHospRoleReceptionist.addEventListener('click', () => {
            hospActiveRole = 'reception';
            btnHospRoleReceptionist.classList.add('active');
            btnHospRoleDoctor.classList.remove('active');
            hospEmail.value = 'receptionist.vavuniya@lifecare.lk';
        });
        
        btnHospRoleDoctor.addEventListener('click', () => {
            hospActiveRole = 'doctor';
            btnHospRoleDoctor.classList.add('active');
            btnHospRoleReceptionist.classList.remove('active');
            hospEmail.value = 'doctor.silva@lifecare.lk';
        });
    }
    
    // Enter Console login submit
    if (hospBtnLogin) {
        hospBtnLogin.addEventListener('click', () => {
            hospBtnLogin.style.transform = 'scale(0.95)';
            setTimeout(() => {
                hospBtnLogin.style.transform = '';
                showHospScreen(hospActiveRole);
            }, 300);
        });
    }
    
    // Logouts
    if (hospReceptionLogout) hospReceptionLogout.addEventListener('click', () => showHospScreen('login'));
    if (hospDoctorLogout) hospDoctorLogout.addEventListener('click', () => showHospScreen('login'));
    
    // Quick controls
    if (btnCtrlHospLogin) btnCtrlHospLogin.addEventListener('click', () => showHospScreen('login'));
    if (btnCtrlHospReception) btnCtrlHospReception.addEventListener('click', () => showHospScreen('reception'));
    if (btnCtrlHospDoctor) btnCtrlHospDoctor.addEventListener('click', () => showHospScreen('doctor'));
    
    // Receptionist Patient Registration Flow
    if (btnHospRegister) {
        btnHospRegister.addEventListener('click', () => {
            const name = hospPatientName.value || 'Nimal Perera';
            const age = hospPatientAge.value || '38';
            const doc = hospSelectDoctor.value || 'Dr. K. Silva (Cardiologist)';
            
            // Sync values to result panel & doctor queue
            valBookingPatientName.textContent = name;
            valBookingPatientAge.textContent = age;
            valBookingDoctor.textContent = doc.split(' ')[0] + ' ' + doc.split(' ')[1];
            
            gradingPatientName.textContent = name;
            hospBillPatient.textContent = name;
            
            btnHospRegister.style.opacity = '0.7';
            setTimeout(() => {
                hospBookingForm.style.display = 'none';
                hospBookingSuccess.style.display = 'flex';
                btnHospRegister.style.opacity = '1';
            }, 800);
        });
    }
    
    // Doctor Consultation Billing Flow
    if (btnHospSubmitConsultation) {
        btnHospSubmitConsultation.addEventListener('click', () => {
            btnHospSubmitConsultation.style.opacity = '0.7';
            setTimeout(() => {
                hospDoctorForm.style.display = 'none';
                hospConsultationSuccess.style.display = 'flex';
                btnHospSubmitConsultation.style.opacity = '1';
            }, 850);
        });
    }
});
