// login.js
import { auth, provider } from './firebase-init.js';
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginEmailBtn = document.getElementById('loginEmailBtn');
    const loginGoogleBtn = document.getElementById('loginGoogleBtn');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorDiv = document.getElementById('login-error');

    async function storeToken(user) {
        const token = await user.getIdToken();
        // Save in localStorage so your extension can read it
        localStorage.setItem('firebaseToken', token);

        // Optional: send token to extension automatically
        if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ token });
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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await storeToken(userCredential.user);
            window.location.href = 'success.html';
        } catch (err) {
            console.error(err);
            errorDiv.textContent = err.message;
        }
    });

    // Google Login
    loginGoogleBtn.addEventListener('click', async () => {
        try {
            const userCredential = await signInWithPopup(auth, provider);
            await storeToken(userCredential.user);
            window.location.href = 'success.html';
        } catch (err) {
            console.error(err);
            errorDiv.textContent = err.message;
        }
    });
});
