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
    const cardElement = document.querySelector('.card'); // Get the main card element

    function showUserFriendlyError(error) {
        let message = "An unknown error occurred. Please try again.";
        if (error.code) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    // This message was updated in a previous step
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

    // --- CORRECTED FUNCTION ---
    // This function now correctly shows the success message and starts the countdown.
    async function handleSuccessfulLogin(isNewUser = false) {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            const email = user.email;

            // Send the user data to the background script
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

        const message = isNewUser ? "Account Created!" : "Login Successful!";
        
        // Replace the card's content with the success message and countdown
        cardElement.innerHTML = `
            <div class="card-header">
                <h2>${message}</h2>
                <p>You can now close this tab.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--muted-foreground);">
                    This page will now redirect to the homepage in <span id="countdown">5</span> seconds...
                </p>
            </div>
        `;

        let countdown = 5;
        const countdownElement = document.getElementById('countdown');

        const interval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(interval);
                // Redirect to the main homepage
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