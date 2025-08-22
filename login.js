// login.js
import { auth, provider } from './firebase-init.js';
import { getAdditionalUserInfo, signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// IMPORTANT: You must replace this with your actual extension ID.
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
                case 'auth/invalid-credential':
                    message = "Account not found or password incorrect. Please sign up if you don't have an account.";
                    break;
                case 'auth/too-many-requests':
                    message = "Access to this account has been temporarily disabled due to many failed login attempts.";
                    break;
                default:
                    message = "The email or password are incorrect, please try again.";
            }
        }
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

    async function handleSuccessfulLogin(isNewUser = false) {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            const email = user.email;

            // Send the actual user data to the background script
            if (chrome && chrome.runtime) {
                chrome.runtime.sendMessage(
                    EXTENSION_ID, 
                    { type: "LOGIN_SUCCESS", token: token, email: email }, 
                    () => {} // Empty callback to prevent console errors
                );
            }
        }

        const message = isNewUser ? "Account Created!" : "Login Successful!";
        document.body.innerHTML = `<div class="card"><h2>${message}</h2><p>You can now close this tab.</p></div>`;
    }

    // Email/Password Login
    loginEmailBtn.addEventListener('click', async () => {
        errorContainer.style.display = 'none';
        try {
            await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
            await handleSuccessfulLogin(false);
        } catch (err) {
            showUserFriendlyError(err);
        }
    });

    // Google Login
    loginGoogleBtn.addEventListener('click', async () => {
        errorContainer.style.display = 'none';
        try {
            const result = await signInWithPopup(auth, provider);
            const additionalUserInfo = getAdditionalUserInfo(result);
            await handleSuccessfulLogin(additionalUserInfo.isNewUser);
        } catch (err) {
            showUserFriendlyError(err);
        }
    });
});