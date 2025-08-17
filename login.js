// login.js
import { auth, provider } from './firebase-init.js';
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// IMPORTANT: Replace this with your actual extension ID.
// You can find it in Chrome's Extensions page (chrome://extensions) in developer mode.
const EXTENSION_ID = "hajgbjgbdejejppmmikigepdcjdngamn"; 

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
                case 'auth/invalid-email':
                case 'auth/invalid-credential':
                case 'auth/user-not-found': // Kept for older SDK versions
                    message = "Invalid email or password. Please check your credentials and try again.";
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
        console.log("Login successful, sending message to extension.");
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage(EXTENSION_ID, { type: "LOGIN_SUCCESS" }, (response) => {
                if (chrome.runtime.lastError) {
                    // This error means the extension is not listening, which is fine.
                    // The tab might not be closed automatically, but login still worked.
                    console.warn("Could not establish connection. Extension might not be installed or active.");
                    document.body.innerHTML = `<div class="card"><h2>Login Successful!</h2><p>You can now close this tab.</p></div>`;
                } else {
                    console.log("Message sent, response:", response);
                }
            });
        } else {
            // Fallback for when not opened by extension
            console.log("Not in an extension context. Showing success message.");
            document.body.innerHTML = `<div class="card"><h2>Login Successful!</h2><p>You can now close this tab.</p></div>`;
        }
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