// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Navbar scroll behavior
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll Down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll Up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});

// Video placeholder click handler and "Watch Demo" button
const watchDemoBtn = document.querySelector('.secondary-button');

if (watchDemoBtn) {
    watchDemoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const demoSection = document.querySelector('#demo');
        if (demoSection) {
            demoSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Handle sign up buttons
const signUpButtons = document.querySelectorAll('.primary-button, .cta-button, .pricing-button');
signUpButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Show sign up form modal
        showSignUpModal();
    });
});

// Sign up modal function
function showSignUpModal() {
    // Create modal container
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', 'signup-modal');
    
    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
        document.body.removeChild(modal);
        document.body.classList.remove('modal-open');
    };
    
    // Create sign up form
    const signUpForm = document.createElement('form');
    signUpForm.classList.add('signup-form');
    signUpForm.innerHTML = `
        <h3>Join Walnut</h3>
        <p>Sign up to get early access to Walnut and be the first to experience our smart note-taking platform.</p>
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" placeholder="Your name" required>
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Your email" required>
        </div>
        <div class="form-group">
            <label for="year">Year Level</label>
            <select id="year" required>
                <option value="">Select your year</option>
                <option value="1">High School</option>
                <option value="2">First Year</option>
                <option value="3">Second Year</option>
                <option value="4">Third Year</option>
                <option value="5">Fourth Year</option>
                <option value="6">Fifth year (+)</option>
                <option value="7">Graduate Student</option>
            </select>
        </div>
        <button type="submit" class="form-button">Join Waitlist</button>
    `;
    
    // Handle form submission
    signUpForm.onsubmit = async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const year = document.getElementById('year').value;
        
        try {
            await submitToMongoDB({ name, email, year });
            
            // Replace form with success message
            modalContent.innerHTML = '';
            
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.innerHTML = `
                <h3>Thank You, ${name}!</h3>
                <p>You've been added to our waitlist. We'll notify you at ${email} when Walnut is ready for you.</p>
                <button class="form-button close-modal-btn">Close</button>
            `;
            
            modalContent.appendChild(successMessage);
            
            // Add close functionality to button
            document.querySelector('.close-modal-btn').onclick = () => {
                document.body.removeChild(modal);
                document.body.classList.remove('modal-open');
            };
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your form. Please try again later.');
        }
    };
    
    // Append elements to modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(signUpForm);
    modal.appendChild(modalContent);
    
    // Add modal to body
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    
    // Close modal when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.classList.remove('modal-open');
        }
    };
}

// Async function to submit form data to MongoDB
async function submitToMongoDB(formData) {
    try {
        const response = await fetch('/api/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error submitting to MongoDB:', error);
        throw error;
    }
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (email) {
            // Here you would typically send the email to your backend
            alert('Thank you for subscribing to Walnut updates!');
            emailInput.value = '';
        }
    });
}

// Add CSS for modal and animations
const style = document.createElement('style');
style.textContent = `
    .fade-in-section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in-section.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .navbar.scroll-down {
        transform: translateY(-100%);
    }
    
    .navbar.scroll-up {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .navbar {
        transition: transform 0.3s ease-in-out;
    }
    
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
    }
    
    .modal-content {
        background-color: white;
        padding: 30px;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        position: relative;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 24px;
        cursor: pointer;
        color: #5c3e3e;
    }
    
    .video-message {
        text-align: center;
        padding: 20px 0;
    }
    
    .video-message h3 {
        color: #be8a00;
        margin-bottom: 15px;
    }
    
    .signup-form {
        padding: 10px 0;
    }
    
    .signup-form h3 {
        color: #be8a00;
        margin-bottom: 10px;
        text-align: center;
    }
    
    .signup-form p {
        margin-bottom: 20px;
        text-align: center;
    }
    
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
        color: #5c3e3e;
    }
    
    .form-group input,
    .form-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    .form-button {
        background-color: #be8a00;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 10px;
        width: 100%;
    }
    
    .form-button:hover {
        background-color: #a67a00;
    }
    
    .success-message {
        text-align: center;
        padding: 20px 0;
    }
    
    .success-message h3 {
        color: #be8a00;
        margin-bottom: 15px;
    }
    
    body.modal-open {
        overflow: hidden;
    }
`;
document.head.appendChild(style); 