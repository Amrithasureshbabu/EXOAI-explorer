// ExoAI Explorer Login Page - Interactive Functionality
class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.messageContainer = document.getElementById('messageContainer');
        this.messageContent = document.getElementById('messageContent');
        this.loginButton = document.querySelector('.login-button');
        this.buttonText = document.querySelector('.button-text');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addInputAnimations();
        this.createParticleEffect();
        this.addKeyboardShortcuts();
    }

    // Event Listeners
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Input focus animations
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.animateInputFocus(input);
            });

            input.addEventListener('blur', () => {
                this.animateInputBlur(input);
            });

            input.addEventListener('input', () => {
                this.validateInput(input);
            });
        });

        // Remember me checkbox animation
        const checkbox = document.getElementById('rememberMe');
        checkbox.addEventListener('change', () => {
            this.animateCheckbox(checkbox);
        });

        // Forgot password link
        const forgotPasswordLink = document.querySelector('.forgot-password');
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordModal();
        });
    }

    // Input Animations
    addInputAnimations() {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach((input, index) => {
            // Staggered animation on page load
            setTimeout(() => {
                input.style.opacity = '0';
                input.style.transform = 'translateY(20px)';
                input.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    input.style.opacity = '1';
                    input.style.transform = 'translateY(0)';
                }, 100);
            }, index * 150);
        });
    }

    animateInputFocus(input) {
        const container = input.closest('.input-container');
        const icon = container.querySelector('.input-icon');
        
        // Add glow effect
        input.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1), 0 0 20px rgba(0, 212, 255, 0.2)';
        
        // Animate icon
        if (icon) {
            icon.style.transform = 'scale(1.1)';
            icon.style.color = '#00d4ff';
        }

        // Add floating label effect
        const label = input.closest('.form-group').querySelector('.form-label');
        if (label) {
            label.style.transform = 'translateY(-2px)';
            label.style.color = '#00d4ff';
        }
    }

    animateInputBlur(input) {
        const container = input.closest('.input-container');
        const icon = container.querySelector('.input-icon');
        
        // Remove glow effect
        input.style.boxShadow = '';
        
        // Reset icon
        if (icon) {
            icon.style.transform = 'scale(1)';
            icon.style.color = 'rgba(0, 212, 255, 0.6)';
        }

        // Reset label
        const label = input.closest('.form-group').querySelector('.form-label');
        if (label) {
            label.style.transform = 'translateY(0)';
            label.style.color = '#00d4ff';
        }
    }

    validateInput(input) {
        const value = input.value.trim();
        const container = input.closest('.form-group');
        
        // Remove existing validation classes
        container.classList.remove('valid', 'invalid');
        
        if (value.length > 0) {
            if (input.type === 'email' || input.name === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(value)) {
                    container.classList.add('valid');
                } else if (value.length > 3) {
                    container.classList.add('invalid');
                }
            } else if (input.type === 'password') {
                if (value.length >= 6) {
                    container.classList.add('valid');
                } else if (value.length > 0) {
                    container.classList.add('invalid');
                }
            } else {
                container.classList.add('valid');
            }
        }
    }

    animateCheckbox(checkbox) {
        const checkmark = checkbox.nextElementSibling;
        
        if (checkbox.checked) {
            checkmark.style.transform = 'scale(1.1)';
            checkmark.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
            
            setTimeout(() => {
                checkmark.style.transform = 'scale(1)';
            }, 200);
        } else {
            checkmark.style.transform = 'scale(0.9)';
            checkmark.style.boxShadow = '';
            
            setTimeout(() => {
                checkmark.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Login Handling
    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate inputs
        if (!this.validateForm(email, password)) {
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call
            await this.simulateLogin(email, password, rememberMe);
            
            // Success
            this.showMessage('Login successful! Redirecting to ExoAI Explorer...', 'success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            // Error
            this.showMessage(error.message, 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm(email, password) {
        if (!email) {
            this.showMessage('Please enter your email or username', 'error');
            document.getElementById('email').focus();
            return false;
        }

        if (!password) {
            this.showMessage('Please enter your password', 'error');
            document.getElementById('password').focus();
            return false;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long', 'error');
            document.getElementById('password').focus();
            return false;
        }

        return true;
    }

    async simulateLogin(email, password, rememberMe) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Demo credentials for testing
        const validCredentials = [
            { email: 'admin@exoai.com', password: 'admin123' },
            { email: 'user@exoai.com', password: 'user123' },
            { email: 'demo@exoai.com', password: 'demo123' },
            { email: 'test', password: 'test123' },
            { email: 'demo', password: 'demo' }
        ];

        const isValid = validCredentials.some(cred => 
            (cred.email === email || cred.email.split('@')[0] === email) && 
            cred.password === password
        );

        if (!isValid) {
            throw new Error('Invalid email/username or password. Try: demo@exoai.com / demo123');
        }

        // Store login state
        if (rememberMe) {
            localStorage.setItem('exoai_remember', 'true');
            localStorage.setItem('exoai_user', email);
        } else {
            sessionStorage.setItem('exoai_user', email);
        }

        return { success: true, user: email };
    }

    setLoadingState(loading) {
        if (loading) {
            this.loginButton.classList.add('loading');
            this.buttonText.textContent = 'Logging in...';
            this.loginButton.disabled = true;
        } else {
            this.loginButton.classList.remove('loading');
            this.buttonText.textContent = 'Login';
            this.loginButton.disabled = false;
        }
    }

    showMessage(message, type) {
        // Clear previous message
        this.messageContainer.classList.add('hidden');
        
        setTimeout(() => {
            this.messageContent.innerHTML = this.createMessageHTML(message, type);
            this.messageContainer.className = `message-container ${type}`;
            
            setTimeout(() => {
                this.messageContainer.classList.remove('hidden');
            }, 100);
        }, 300);
    }

    createMessageHTML(message, type) {
        const icons = {
            success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
            error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
            info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };

        return `
            <div class="flex items-center gap-2">
                ${icons[type] || icons.info}
                <span>${message}</span>
            </div>
        `;
    }

    // Password Toggle
    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleButton = document.querySelector('.password-toggle');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
            `;
        } else {
            passwordInput.type = 'password';
            toggleButton.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
            `;
        }
    }

    // Forgot Password Modal
    showForgotPasswordModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.style.cssText = `
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
        `;

        modal.innerHTML = `
            <div class="bg-space-blue border border-glass-border rounded-2xl p-6 max-w-md w-full mx-4" style="background: rgba(10, 14, 39, 0.95); backdrop-filter: blur(20px);">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-orbitron font-bold text-neon-cyan">Reset Password</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-gray-300 mb-4">Enter your email address and we'll send you a password reset link.</p>
                <form id="forgotPasswordForm" class="space-y-4">
                    <div>
                        <input type="email" placeholder="Enter your email" class="form-input w-full" required>
                    </div>
                    <div class="flex gap-3">
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 px-4 py-2 bg-neon-cyan text-white rounded-lg hover:bg-neon-blue transition-colors">
                            Send Reset Link
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        modal.querySelector('#forgotPasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            
            if (email) {
                // Simulate sending reset email
                setTimeout(() => {
                    modal.remove();
                    this.showMessage('Password reset link sent to your email!', 'success');
                }, 1000);
            }
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Particle Effect
    createParticleEffect() {
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach(particle => {
            // Randomize initial position and animation
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        });
    }

    // Keyboard Shortcuts
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Enter key submits form
            if (e.key === 'Enter' && e.target.classList.contains('form-input')) {
                this.form.dispatchEvent(new Event('submit'));
            }
            
            // Escape key closes modals
            if (e.key === 'Escape') {
                const modal = document.querySelector('.fixed');
                if (modal) {
                    modal.remove();
                }
            }
        });
    }

    // Check for remembered login
    checkRememberedLogin() {
        const remembered = localStorage.getItem('exoai_remember');
        const user = localStorage.getItem('exoai_user') || sessionStorage.getItem('exoai_user');
        
        if (remembered === 'true' && user) {
            document.getElementById('email').value = user;
            document.getElementById('rememberMe').checked = true;
        }
    }
}

// Password toggle function (global for onclick)
function togglePassword() {
    if (window.loginManager) {
        window.loginManager.togglePassword();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loginManager = new LoginManager();
    window.loginManager.checkRememberedLogin();
    
    // Add page load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add some interactive effects
window.addEventListener('load', () => {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.form-input, .login-button, .forgot-password, .back-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-1px)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });
});
