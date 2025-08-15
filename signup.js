// signup.js
import { auth, provider } from './firebase-init.js';
import { createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const signupEmailBtn = document.getElementById('signupEmailBtn');
    const signupGoogleBtn = document.getElementById('signupGoogleBtn');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorDiv = document.getElementById('signup-error');

    // Helper: send token to extension
    async function sendTokenToExtension() {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            // Post message to extension
            window.postMessage({ type: "FROM_WEB_APP", token }, "*");
        }
    }

    // Email/Password Sign Up
    signupEmailBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        errorDiv.textContent = '';
        if (!email || !password) {
            errorDiv.textContent = "Email and password cannot be empty.";
            return;
        }
        if (password.length < 6) {
            errorDiv.textContent = "Password must be at least 6 characters long.";
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await sendTokenToExtension();
            window.location.href = 'success.html';
        } catch (err) {
            console.error(err);
            errorDiv.textContent = err.message;
        }
    });

    // Google Sign Up
    signupGoogleBtn.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, provider);
            await sendTokenToExtension();
            window.location.href = 'success.html';
        } catch (err) {
            console.error(err);
            errorDiv.textContent = err.message;
        }
    });
});
