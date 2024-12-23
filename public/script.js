// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 100) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

// Scroll to reservation section with smooth animation
function scrollToReservation() {
    document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
}

// Form visibility animation on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('form-visible');
        }
    });
}, { threshold: 0.1 });

observer.observe(document.querySelector('.form-container'));

function validateForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;

    // Basic validation
    if (!name || !email || !phone || !date || !time || !guests) {
        showError('Please fill in all required fields');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        showError('Please enter a valid 10-digit phone number');
        return false;
    }

    // Date validation
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showError('Please select a future date');
        return false;
    }

    return true;
}

function showError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease forwards;
    `;
    errorMessage.textContent = message;
    document.body.appendChild(errorMessage);

    setTimeout(() => {
        errorMessage.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            errorMessage.remove();
        }, 300);
    }, 3000);
}

function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: document.getElementById('guests').value,
        specialRequests: document.getElementById('special-requests').value
    };

    try {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess();
            document.getElementById('reservationForm').reset();
        } else {
            throw new Error(data.message || 'Error submitting reservation');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error submitting reservation. Please try again.');
    }
}

// Set minimum date for date input
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// Initialize form animations
document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        observer.observe(formContainer);
    }
});