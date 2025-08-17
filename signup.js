// signup.js
import { auth, provider } from './firebase-init.js';
import { createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
                // This is the key change to handle existing accounts.
                case 'auth/email-already-in-use':
                    message = "An account with this email already exists. Please log in.";
                    break;
                case 'auth/invalid-email':
                    message = "Please enter a valid email address.";
                    break;
                case 'auth/weak-password':
                    message = "Password is too weak. It must be at least 6 characters long.";
                    break;
                case 'auth/network-request-failed':
                    message = "Network error. Please check your internet connection.";
                    break;
                default:
                    message = "An error occurred during sign up. Please try again.";
                    console.error("Firebase Auth Error:", error.message);
            }
        }
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

    function handleSuccessfulSignup() {
        console.log("Signup successful!");
        document.body.innerHTML = `<div class="card"><h2>Account Created!</h2><p>You have successfully signed up. You can now close this tab and log in.</p></div>`;
    }

    // Email/Password Sign Up
    signupEmailBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        errorContainer.style.display = 'none';
        if (!email || !password) {
            errorContainer.textContent = "Email and password cannot be empty.";
            errorContainer.style.display = 'block';
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            handleSuccessfulSignup();
        } catch (err) {
            showUserFriendlyError(err);
        }
    });

    // Google Sign Up
    signupGoogleBtn.addEventListener('click', async () => {
        errorContainer.style.display = 'none';
        try {
            // Note: signInWithPopup will log in an existing user automatically.
            // This is standard behavior for OAuth.
            await signInWithPopup(auth, provider);
            handleSuccessfulSignup();
        } catch (err) {
            showUserFriendlyError(err);
        }
    });
});