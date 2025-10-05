// ExoAI Explorer Login Page - Vanilla JavaScript
class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.messageContainer = document.getElementById('messageContainer');
        this.messageContent = document.getElementById('messageContent');
        this.loginButton = document.querySelector('.login-button');
        this.buttonText = document.querySelector('.button-text');
        
        // Hardcoded test credentials
        this.testCredentials = {
            username: 'admin',
            password: '1234'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addInputAnimations();
        this.createParticleEffect();
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
            if (input.type === 'email' || input.name === 'username') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(value)) {
                    container.classList.add('valid');
                } else if (value.length > 3) {
                    container.classList.add('valid');
                }
            } else if (input.type === 'password') {
                if (value.length >= 4) {
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
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate inputs
        if (!this.validateForm(username, password)) {
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check credentials
            if (this.authenticateUser(username, password)) {
                // Success
                this.showMessage('Login successful! Redirecting to ExoAI Explorer...', 'success');
                
                // Store login state
                if (rememberMe) {
                    localStorage.setItem('exoai_remember', 'true');
                    localStorage.setItem('exoai_user', username);
                } else {
                    sessionStorage.setItem('exoai_user', username);
                }
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                // Invalid credentials
                throw new Error('Invalid username or password. Try: admin / 1234');
            }

        } catch (error) {
            // Error
            this.showMessage(error.message, 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm(username, password) {
        if (!username) {
            this.showMessage('Please enter your username or email', 'error');
            document.getElementById('username').focus();
            return false;
        }

        if (!password) {
            this.showMessage('Please enter your password', 'error');
            document.getElementById('password').focus();
            return false;
        }

        if (password.length < 4) {
            this.showMessage('Password must be at least 4 characters long', 'error');
            document.getElementById('password').focus();
            return false;
        }

        return true;
    }

    authenticateUser(username, password) {
        // Check against hardcoded credentials
        return username === this.testCredentials.username && 
               password === this.testCredentials.password;
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
                <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
            `;
        } else {
            passwordInput.type = 'password';
            toggleButton.innerHTML = `
                <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
            `;
        }
    }

    // Forgot Password Modal
    showForgotPasswordModal() {
        const modal = document.createElement('div');
        modal.className = 'forgot-password-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                background: rgba(10, 14, 39, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 16px;
                padding: 24px;
                max-width: 400px;
                width: 100%;
                margin: 0 16px;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="font-family: 'Orbitron', monospace; font-size: 1.25rem; font-weight: 700; color: #00d4ff;">Reset Password</h3>
                    <button onclick="this.closest('.forgot-password-modal').remove()" style="
                        background: none;
                        border: none;
                        color: #888888;
                        cursor: pointer;
                        transition: color 0.3s ease;
                    " onmouseover="this.style.color='white'" onmouseout="this.style.color='#888888'">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <p style="color: #cccccc; margin-bottom: 16px;">Enter your email address and we'll send you a password reset link.</p>
                <form id="forgotPasswordForm" style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <input type="email" placeholder="Enter your email" style="
                            width: 100%;
                            padding: 12px;
                            background: rgba(255, 255, 255, 0.05);
                            border: 1px solid rgba(0, 212, 255, 0.2);
                            border-radius: 8px;
                            color: white;
                            font-size: 1rem;
                            transition: all 0.3s ease;
                        " required>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button type="button" onclick="this.closest('.forgot-password-modal').remove()" style="
                            flex: 1;
                            padding: 12px;
                            background: #666666;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: background 0.3s ease;
                        " onmouseover="this.style.background='#777777'" onmouseout="this.style.background='#666666'">
                            Cancel
                        </button>
                        <button type="submit" style="
                            flex: 1;
                            padding: 12px;
                            background: #00d4ff;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: background 0.3s ease;
                        " onmouseover="this.style.background='#0099cc'" onmouseout="this.style.background='#00d4ff'">
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

    // Check for remembered login
    checkRememberedLogin() {
        const remembered = localStorage.getItem('exoai_remember');
        const user = localStorage.getItem('exoai_user') || sessionStorage.getItem('exoai_user');
        
        if (remembered === 'true' && user) {
            document.getElementById('username').value = user;
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

// Forgot password function (global for onclick)
function showForgotPassword() {
    if (window.loginManager) {
        window.loginManager.showForgotPasswordModal();
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
