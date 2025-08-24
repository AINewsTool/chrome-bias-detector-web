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
    const cardElement = document.querySelector('.card');
    // Get the back button
    const backButton = document.getElementById('back-to-home-btn');

    function showUserFriendlyError(error) {
        let message = "An unknown error occurred. Please try again.";
        if (error.code) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    message = "The email or password incorrect, please try again.";
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

    async function handleSuccessfulLogin(isNewUser = false) {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            const email = user.email;

            if (chrome && chrome.runtime) {
                chrome.runtime.sendMessage(
                    EXTENSION_ID, 
                    { type: "LOGIN_SUCCESS", token: token, email: email }, 
                    (response) => {
                        if (chrome.runtime.lastError) {
                            console.log("Could not send login message to extension.");
                        }
                    }
                );
            }
        }

        // --- HIDE THE BACK BUTTON ---
        if(backButton) {
            backButton.style.display = 'none';
        }

        const message = isNewUser ? "Account Created!" : "Login Successful!";
        
        // --- CORRECTED HTML STRUCTURE FOR SUCCESS MESSAGE ---
        cardElement.innerHTML = `
            <div class="card-header">
                <h2>${message}</h2>
                <p>You can now close this tab.</p>
            </div>
            <div class="success-box">
                This page will redirect to the homepage in <strong id="countdown">5</strong> seconds...
            </div>
        `;

        let countdown = 5;
        const countdownElement = document.getElementById('countdown');

        const interval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(interval);
                window.location.href = '../'; 
            }
        }, 1000);
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