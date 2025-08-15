// login.js
import { auth, provider } from './firebase-init.js';
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginEmailBtn = document.getElementById('loginEmailBtn');
    const loginGoogleBtn = document.getElementById('loginGoogleBtn');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorDiv = document.getElementById('login-error');

    // Helper: send token to extension
    async function sendTokenToExtension() {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            // Post message to extension
            window.postMessage({ type: "FROM_WEB_APP", token }, "*");
        }
    }

    // Email/Password Login
    loginEmailBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        errorDiv.textContent = '';
        if (!email || !password) {
            errorDiv.textContent = "Email and password cannot be empty.";
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            await sendTokenToExtension();
            window.location.href = 'success.html';
        } catch (err) {
            console.error(err);
            errorDiv.textContent = err.message;
        }
    });

    // Google Login
    loginGoogleBtn.addEventListener('click', async () => {
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
