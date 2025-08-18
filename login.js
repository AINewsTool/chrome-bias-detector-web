// login.js
import { auth, provider } from './firebase-init.js';
import { getAdditionalUserInfo, signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
                case 'auth/invalid-credential':
                    message = "Account not found or password incorrect. Please sign up if you don't have an account.";
                    break;
                case 'auth/too-many-requests':
                    message = "Access to this account has been temporarily disabled due to many failed login attempts.";
                    break;
                default:
                    message = "An error occurred during login. Please try again.";
            }
        }
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

    // This function simply shows a success message on the page.
    function handleSuccessfulLogin(isNewUser = false) {
        const message = isNewUser ? "Account Created!" : "Login Successful!";
        document.body.innerHTML = `<div class="card"><h2>${message}</h2><p>You can now close this tab.</p></div>`;
    }

    // Email/Password Login
    loginEmailBtn.addEventListener('click', async () => {
        // --- ADD THIS LOG ---
        console.log("Login with Email button clicked on the webpage.");

        errorContainer.style.display = 'none';
        try {
            await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
            handleSuccessfulLogin(false);
        } catch (err) {
            showUserFriendlyError(err);
        }
    });

    // Google Login
    loginGoogleBtn.addEventListener('click', async () => {
        // --- ADD THIS LOG ---
        console.log("Login with Google button clicked on the webpage.");
        
        errorContainer.style.display = 'none';
        try {
            const result = await signInWithPopup(auth, provider);
            const additionalUserInfo = getAdditionalUserInfo(result);
            handleSuccessfulLogin(additionalUserInfo.isNewUser);
        } catch (err) {
            showUserFriendlyError(err);
        }
    });
});