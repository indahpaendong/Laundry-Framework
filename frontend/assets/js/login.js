/**
 * LaundryGo - Login Page Logic
 * File: assets/js/login.js
 * Compatible with: backend/login.php (PDO version)
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const btnLogin = document.getElementById('btnLogin');
    const togglePassword = document.getElementById('togglePassword');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const successOverlay = document.getElementById('successOverlay');
    
    if (!loginForm) return;

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.querySelector('i').className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
        });
    }

    // Auto-fill remembered email
    const rememberedEmail = localStorage.getItem('laundrygo_remember_email');
    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const email = formData.get('email');
        const password = formData.get('password');

        // Client-side validation
        if (!email || !password) {
            showError('Email dan password harus diisi');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Format email tidak valid');
            return;
        }

        // Loading state
        const originalBtnContent = btnLogin.innerHTML;
        btnLogin.disabled = true;
        btnLogin.innerHTML = '<div class="spinner"></div> Memproses...';
        hideError();

        try {
            const response = await fetch('backend/login.php', {
                method: 'POST',
                body: formData,
                credentials: 'include' // Important for session cookies
            });

            const result = await response.json();

            if (result.success) {
                // Save remember me
                if (formData.get('remember')) {
                    localStorage.setItem('laundrygo_remember_email', email);
                } else {
                    localStorage.removeItem('laundrygo_remember_email');
                }

                // Show success overlay
                if (successOverlay) {
                    successOverlay.classList.add('active');
                }

                // Redirect
                setTimeout(() => {
                    window.location.href = result.data?.redirect || 'dashboard.html';
                }, 1500);
            } else {
                showError(result.message);
                resetButton();
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Terjadi kesalahan koneksi. Silakan coba lagi.');
            resetButton();
        }

        function resetButton() {
            btnLogin.disabled = false;
            btnLogin.innerHTML = originalBtnContent;
        }
    });

    // Helper: Show error message
    function showError(message) {
        if (errorMessage && errorText) {
            errorText.textContent = message;
            errorMessage.classList.add('show');
            
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000);
        }
    }

    // Helper: Hide error message
    function hideError() {
        if (errorMessage) {
            errorMessage.classList.remove('show');
        }
    }

    // Helper: Validate email format
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Enter key support
    passwordInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});