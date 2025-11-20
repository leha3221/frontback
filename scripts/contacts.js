

document.addEventListener('DOMContentLoaded', function() {
    
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    
    initializeFormAccessibility();

    
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);

    
    nameInput.addEventListener('input', debounce(validateName, 500));
    emailInput.addEventListener('input', debounce(validateEmail, 500));
    messageInput.addEventListener('input', debounce(validateMessage, 500));

    
    contactForm.addEventListener('submit', handleFormSubmit);

    
    document.addEventListener('keydown', handleKeyboardNavigation);

   
    function initializeFormAccessibility() {
        
        if (!nameInput.hasAttribute('aria-required')) {
            nameInput.setAttribute('aria-required', 'true');
        }
        if (!emailInput.hasAttribute('aria-required')) {
            emailInput.setAttribute('aria-required', 'true');
        }
        if (!messageInput.hasAttribute('aria-required')) {
            messageInput.setAttribute('aria-required', 'true');
        }

     
        nameInput.setAttribute('aria-invalid', 'false');
        emailInput.setAttribute('aria-invalid', 'false');
        messageInput.setAttribute('aria-invalid', 'false');

        
        [nameError, emailError, messageError].forEach(error => {
            error.style.display = 'none';
            error.setAttribute('aria-live', 'polite');
        });
    }

    
    function validateName() {
        const name = nameInput.value.trim();
        
        if (name.length === 0) {
            showError(nameInput, nameError, 'Поле "Имя" обязательно для заполнения');
            return false;
        } else if (name.length < 2) {
            showError(nameInput, nameError, 'Имя должно содержать минимум 2 символа');
            return false;
        } else if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name)) {
            showError(nameInput, nameError, 'Имя может содержать только буквы, пробелы и дефисы');
            return false;
        } else {
            clearError(nameInput, nameError);
            return true;
        }
    }

    
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email.length === 0) {
            showError(emailInput, emailError, 'Поле "Email" обязательно для заполнения');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'Введите корректный email адрес (например: user@example.com)');
            return false;
        } else {
            clearError(emailInput, emailError);
            return true;
        }
    }

    
    function validateMessage() {
        const message = messageInput.value.trim();
        
        if (message.length === 0) {
            showError(messageInput, messageError, 'Поле "Сообщение" обязательно для заполнения');
            return false;
        } else if (message.length < 10) {
            showError(messageInput, messageError, 'Сообщение должно содержать минимум 10 символов');
            return false;
        } else if (message.length > 1000) {
            showError(messageInput, messageError, 'Сообщение не должно превышать 1000 символов');
            return false;
        } else {
            clearError(messageInput, messageError);
            return true;
        }
    }


    function showError(input, errorElement, message) {
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.setAttribute('role', 'alert');

    
        announceToScreenReader(`Ошибка: ${message}`);
    }


    function clearError(input, errorElement) {
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        errorElement.removeAttribute('role');
    }

    
    function handleFormSubmit(event) {
        event.preventDefault();
        
    
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        if (isNameValid && isEmailValid && isMessageValid) {
        
            showSuccessMessage();
            
        
            contactForm.reset();
            resetValidation();
            
        
            console.log('Форма отправлена:', {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            });
        } else {
        
            focusFirstError();
            
            
            announceToScreenReader('Форма содержит ошибки. Пожалуйста, исправьте отмеченные поля.');
        }
    }

    
    function showSuccessMessage() {

        const successMessage = document.createElement('div');
        successMessage.setAttribute('role', 'alert');
        successMessage.setAttribute('aria-live', 'assertive');
        successMessage.setAttribute('aria-atomic', 'true');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>✅ Сообщение отправлено успешно!</h3>
            <p>Спасибо за ваше сообщение. Я свяжусь с вами в ближайшее время.</p>
            <button class="close-success-btn">Закрыть</button>
        `;
        

        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            width: 90%;
            border: 3px solid #28a745;
            text-align: center;
        `;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(successMessage);
        
        successMessage.setAttribute('tabindex', '-1');
        successMessage.focus();
        
    
        const closeBtn = successMessage.querySelector('.close-success-btn');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
            document.body.removeChild(successMessage);
            contactForm.querySelector('button[type="submit"]').focus();
        });
        const handleEscape = function(event) {
            if (event.key === 'Escape') {
                document.body.removeChild(overlay);
                document.body.removeChild(successMessage);
                document.removeEventListener('keydown', handleEscape);
                contactForm.querySelector('button[type="submit"]').focus();
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                document.body.removeChild(overlay);
                document.body.removeChild(successMessage);
                document.removeEventListener('keydown', handleEscape);
                contactForm.querySelector('button[type="submit"]').focus();
            }
        }, 5000);
    }
    function resetValidation() {
        [nameInput, emailInput, messageInput].forEach(input => {
            input.setAttribute('aria-invalid', 'false');
            input.classList.remove('error');
        });
        
        [nameError, emailError, messageError].forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
            error.removeAttribute('role');
        });
    }
    function focusFirstError() {
        const firstErrorInput = document.querySelector('input[aria-invalid="true"], textarea[aria-invalid="true"]');
        if (firstErrorInput) {
            firstErrorInput.focus();
        }
    }
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    function handleKeyboardNavigation(event) {
        if (event.key === 'Escape') {
            const errorMessages = document.querySelectorAll('.error-message[style*="display: block"]');
            if (errorMessages.length > 0) {
                const firstError = errorMessages[0];
                const relatedInput = firstError.closest('.form-group').querySelector('input, textarea');
                if (relatedInput) {
                    relatedInput.focus();
                    event.preventDefault();
                }
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
        
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            if (contactForm.contains(document.activeElement)) {
                contactForm.requestSubmit();
                event.preventDefault();
            }
        }
    }
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    if (!document.querySelector('style[data-a11y]')) {
        const style = document.createElement('style');
        style.setAttribute('data-a11y', 'true');
        style.textContent = `
            .visually-hidden {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
            
            .error {
                border-color: #dc3545 !important;
                background-color: #fff5f5 !important;
            }
            
            .success-message button {
                background: #007bff;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 1rem;
            }
            
            .success-message button:hover {
                background: #0056b3;
            }
            
            .success-message button:focus {
                outline: 3px solid #0066cc;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
});