// login.js
import { auth, provider } from './firebase-init.js';
import { getAdditionalUserInfo, signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const CLOUD_FUNCTION_URL = "https://us-central1-biasdetectorextension.cloudfunctions.net/createCustomToken";
// IMPORTANT: You must replace this with your actual extension ID.
// const EXTENSION_ID = "pncjbinbmlfgkgedabggpfgafomgjamn"; // For production
const EXTENSION_ID = "hajgbjgbdejejppmmikigepdcjdngamn"; // For testing with Bias Detector

document.addEventListener('DOMContentLoaded', () => {
    const loginEmailBtn = document.getElementById('loginEmailBtn');
    const loginGoogleBtn = document.getElementById('loginGoogleBtn');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorContainer = document.getElementById('error-container');
    const cardElement = document.querySelector('.card');

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
            try {
                const idToken = await user.getIdToken();

                // 1. Call your new Cloud Function to get a custom token
                const response = await fetch(CLOUD_FUNCTION_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken: idToken })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to get custom token.');
                }
                
                const data = await response.json();
                const customToken = data.customToken;

                // 2. Send the custom token to the extension
                if (chrome && chrome.runtime && customToken) {
                    chrome.runtime.sendMessage(
                        EXTENSION_ID,
                        { action: "signInWithCustomToken", token: customToken },
                        (response) => {
                            if (chrome.runtime.lastError || response?.status !== "success") {
                            console.error("Failed to sign in extension:", chrome.runtime.lastError?.message || response?.message);
                            }
                        }
                    );
                }
            } catch (error) {
                console.error("Error exchanging token:", error);
                showUserFriendlyError({ code: 'custom-token-error', message: error.message });
                return; 
            }
        }

        const message = isNewUser ? "Account Created!" : "Login Successful!";
        
        // **FIX:** The entire content of the card is replaced here.
        // This single step removes the form AND the "Back to Home" button,
        // and inserts the new success message with the correct '.success-box' class.
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
            // Check if countdownElement exists before trying to update it
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
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