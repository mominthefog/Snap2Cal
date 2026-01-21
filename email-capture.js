// Email Capture Form Handler for Snap2Cal
(function() {
    'use strict';

    function initEmailForms() {
        const emailForms = document.querySelectorAll('.snap2cal-email-form');
        
        emailForms.forEach(form => {
            const emailInput = form.querySelector('input[type="email"]');
            const submitButton = form.querySelector('button[type="submit"]');
            const messageDiv = form.querySelector('.email-form-message');
            const source = form.dataset.source || 'form';

            if (!emailInput || !submitButton) return;

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = emailInput.value.trim();
                
                // Basic email validation
                if (!email || !isValidEmail(email)) {
                    showMessage(messageDiv, 'Please enter a valid email address.', 'error');
                    return;
                }

                // Disable button during submission
                submitButton.disabled = true;
                submitButton.textContent = 'Subscribing...';

                // Capture email using analytics
                if (window.Snap2CalAnalytics) {
                    window.Snap2CalAnalytics.captureEmail(email, source);
                }

                // Show success message
                showMessage(messageDiv, 'Thanks! We\'ll keep you updated on Snap2Cal product updates.', 'success');
                
                // Reset form
                emailInput.value = '';
                
                // Re-enable button after delay
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = submitButton.dataset.originalText || 'Subscribe';
                }, 2000);
            });
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showMessage(messageDiv, text, type) {
        if (!messageDiv) return;
        
        messageDiv.textContent = text;
        messageDiv.className = 'email-form-message ' + type;
        messageDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmailForms);
    } else {
        initEmailForms();
    }
})();
