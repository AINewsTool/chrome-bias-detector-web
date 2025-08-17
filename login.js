// login.js
import { auth, provider } from './firebase-init.js';
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginEmailBtn = document.getElementById('loginEmailBtn');
    const loginGoogleBtn = document.getElementById('loginGoogleBtn');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorContainer = document.getElementById('error-container');

    function showUserFriendlyError(error) {
        let message = "An unknown error occurred. Please try again.";
        if (error.code) {
            switch (error.code) {
                // This code is triggered for incorrect passwords or non-existent users.
                case 'auth/invalid-credential':
                    message = "Account not found or password incorrect. Please sign up if you don't have an account.";
                    break;
                case 'auth/too-many-requests':
                    message = "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.";
                    break;
                case 'auth/network-request-failed':
                    message = "Network error. Please check your internet connection.";
                    break;
                default:
                    message = "An error occurred during login. Please try again.";
                    console.error("Firebase Auth Error:", error.message);
            }
        }
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

    function handleSuccessfulLogin() {
        console.log("Login successful!");
        document.body.innerHTML = `<div class="card"><h2>Login Successful!</h2><p>You can now close this tab.</p></div>`;
    }

    // Email/Password Login
    loginEmailBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        errorContainer.style.display = 'none';
        if (!email || !password) {
            errorContainer.textContent = "Email and password cannot be empty.";
            errorContainer.style.display = 'block';
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            handleSuccessfulLogin();
        } catch (err) {
            showUserFriendlyError(err);
        }
    });

    // Google Login
    loginGoogleBtn.addEventListener('click', async () => {
        errorContainer.style.display = 'none';
        try {
            await signInWithPopup(auth, provider);
            handleSuccessfulLogin();
        } catch (err) {
            showUserFriendlyError(err);
        }
    });
});