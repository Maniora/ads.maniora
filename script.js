document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // NAVIGATION EXPANSE & HAMBURGER
    // --------------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const body = document.body;

    if (navToggle && navOverlay) {
        navToggle.addEventListener('click', () => {
            const isOpened = body.classList.toggle('nav-active');
            navToggle.setAttribute('aria-expanded', isOpened);
        });

        const menuLinks = navOverlay.querySelectorAll('a');
        menuLinks.forEach((link, idx) => {
            link.style.setProperty('--index', idx + 1);
            link.addEventListener('click', () => {
                body.classList.remove('nav-active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --------------------------------------------------
    // INTERSECTION OBSERVER (SCROLL REVEALS)
    // --------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }


    // --------------------------------------------------
    // FORM SUBMISSION HANDLING (WHATSAPP REDIRECT)
    // --------------------------------------------------
    const alignmentForm = document.getElementById('alignment-form');
    const successState = document.getElementById('form-success');

    if (alignmentForm) {
        alignmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form data
            const formData = new FormData(alignmentForm);
            const name = formData.get('name') || '';
            const email = formData.get('email') || '';
            const budget = formData.get('budget') || '';
            const message = formData.get('message') || '';

            // Format budget for display
            let budgetText = '';
            if (budget === 'under-30k') budgetText = 'Under ₹30,000 (~$350)';
            else if (budget === '30k-75k') budgetText = '₹30,000 – ₹75,000 (~$350 – $900)';
            else if (budget === '75k-2l') budgetText = '₹75,000 – ₹2,00,000 (~$900 – $2,400)';
            else if (budget === '2l-plus') budgetText = '₹2,00,000+ ($2,400+)';
            else budgetText = budget || 'Not specified';

            // Construct WhatsApp message body
            const whatsappMsg = `Hello Maniora Partners,\n\n` +
                                `I would like to start a conversation. Here are my details:\n\n` +
                                `• *Name:* ${name}\n` +
                                `• *Email:* ${email}\n` +
                                `• *Estimated Budget:* ${budgetText}\n` +
                                `• *Project Goals:* ${message}`;

            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/919640161711?text=${encodeURIComponent(whatsappMsg)}`;

            // Hide the form input controls
            const inputsContainer = alignmentForm.querySelector('.form-inputs');
            const submitBtn = alignmentForm.querySelector('button[type="submit"]');
            
            if (inputsContainer) inputsContainer.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'none';
            
            // Set up fallback button URL
            const fallbackBtn = document.getElementById('whatsapp-fallback-btn');
            if (fallbackBtn) {
                fallbackBtn.href = whatsappUrl;
            }

            // Show the success panel
            if (successState) {
                successState.style.display = 'block';
            }

            // Perform redirect in a new tab
            window.open(whatsappUrl, '_blank');
        });
    }
});
