document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            showSuccessMessage();
            contactForm.reset();
            resetValidation();
        }
    });
    
    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = document.getElementById('nameError');
        
        if (name.length < 2) {
            showError(nameInput, errorElement, 'Имя должно содержать минимум 2 символа');
            return false;
        } else if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name)) {
            showError(nameInput, errorElement, 'Имя может содержать только буквы, пробелы и дефисы');
            return false;
        } else {
            clearError(nameInput, errorElement);
            return true;
        }
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showError(emailInput, errorElement, 'Email обязателен для заполнения');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, errorElement, 'Введите корректный email адрес');
            return false;
        } else {
            clearError(emailInput, errorElement);
            return true;
        }
    }
    
    function validateMessage() {
        const message = messageInput.value.trim();
        const errorElement = document.getElementById('messageError');
        
        if (message.length < 10) {
            showError(messageInput, errorElement, 'Сообщение должно содержать минимум 10 символов');
            return false;
        } else if (message.length > 1000) {
            showError(messageInput, errorElement, 'Сообщение не должно превышать 1000 символов');
            return false;
        } else {
            clearError(messageInput, errorElement);
            return true;
        }
    }
    
    function validateForm() {
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        return isNameValid && isEmailValid && isMessageValid;
    }
    
    function showError(input, errorElement, message) {
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'assertive');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'visually-hidden';
        liveRegion.textContent = `Ошибка: ${message}`;
        document.body.appendChild(liveRegion);
        
        setTimeout(() => {
            document.body.removeChild(liveRegion);
        }, 1000);
    }
    
    function clearError(input, errorElement) {
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    function resetValidation() {
        [nameInput, emailInput, messageInput].forEach(input => {
            input.setAttribute('aria-invalid', 'false');
            input.classList.remove('error');
        });
        
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
    }
    
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.setAttribute('role', 'alert');
        successMessage.setAttribute('aria-live', 'assertive');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>Сообщение отправлено!</h3>
            <p>Я свяжусь с вами в ближайшее время.</p>
        `;
        
        contactForm.parentNode.insertBefore(successMessage, contactForm);
        
        successMessage.setAttribute('tabindex', '-1');
        successMessage.focus();
        
        setTimeout(() => {
            successMessage.remove();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.focus();
        }, 5000);
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const errorMessages = document.querySelectorAll('.error-message:not(:empty)');
            if (errorMessages.length > 0) {
                errorMessages[0].closest('.form-group').querySelector('input, textarea').focus();
            }
        }
        
        if (event.key === 'Enter' && event.target.tagName === 'LABEL') {
            const forId = event.target.getAttribute('for');
            if (forId) {
                const targetInput = document.getElementById(forId);
                if (targetInput) {
                    targetInput.focus();
                    event.preventDefault();
                }
            }
        }
    });
});