// signup.js
import { auth, provider } from './firebase-init.js';
import { createUserWithEmailAndPassword, getAdditionalUserInfo, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// IMPORTANT: You must replace this with your actual extension ID.
const EXTENSION_ID = "hajgbjgbdejejppmmikigepdcjdngamn";

document.addEventListener('DOMContentLoaded', () => {
    const signupEmailBtn = document.getElementById('signupEmailBtn');
    const signupGoogleBtn = document.getElementById('signupGoogleBtn');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorContainer = document.getElementById('error-container');

    function showUserFriendlyError(error) {
        let message = "An unknown error occurred. Please try again.";
        if (error.code) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = "An account with this email already exists. Please log in.";
                    break;
                case 'auth/weak-password':
                    message = "Password is too weak. It must be at least 6 characters long.";
                    break;
                default:
                    message = "An error occurred during sign up. Please try again.";
            }
        }
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

    async function handleSuccessfulSignup(isNewUser = true) {
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

    // Email/Password Sign Up
    signupEmailBtn.addEventListener('click', async () => {
        errorContainer.style.display = 'none';
        try {
            await createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
            await handleSuccessfulSignup(true);
        } catch (err) {
            showUserFriendlyError(err);
        }
    });

    // Google Sign Up
    signupGoogleBtn.addEventListener('click', async () => {
        errorContainer.style.display = 'none';
        try {
            const result = await signInWithPopup(auth, provider);
            const additionalUserInfo = getAdditionalUserInfo(result);
            await handleSuccessfulSignup(additionalUserInfo.isNewUser);
        } catch (err) {
            showUserFriendlyError(err);
        }
    });
});