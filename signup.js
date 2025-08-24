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
    const cardElement = document.querySelector('.card'); // Get the main card element

    // Get strength checker elements
    const lengthReq = document.getElementById('length-req');
    const numberReq = document.getElementById('number-req');
    const specialReq = document.getElementById('special-req');

    function showUserFriendlyError(message) {
        // The function now just takes a string to be more flexible
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

    // Password strength checker logic
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const meetsLength = password.length >= 6;
        const meetsNumber = /\d/.test(password);
        const meetsSpecial = /[!@#$%^&*]/.test(password);

        lengthReq.classList.toggle('valid', meetsLength);
        numberReq.classList.toggle('valid', meetsNumber);
        specialReq.classList.toggle('valid', meetsSpecial);
    });


    async function handleSuccessfulSignup(isNewUser = true) {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            const email = user.email;

            if (chrome && chrome.runtime) {
                chrome.runtime.sendMessage(
                    EXTENSION_ID, 
                    { type: "LOGIN_SUCCESS", token: token, email: email }, 
                    () => {}
                );
            }
        }

        // --- NEW SUCCESS MESSAGE AND REDIRECT LOGIC ---
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

    // Email/Password Sign Up
    signupEmailBtn.addEventListener('click', async () => {
        errorContainer.style.display = 'none';

        // Enforce password requirements before trying to create an account
        const isLengthValid = lengthReq.classList.contains('valid');
        const isNumberValid = numberReq.classList.contains('valid');
        const isSpecialValid = specialReq.classList.contains('valid');

        if (!isLengthValid || !isNumberValid || !isSpecialValid) {
            showUserFriendlyError("Your password does not meet all the requirements.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
            await handleSuccessfulSignup(true);
        } catch (err) {
            // Handle Firebase-specific errors
            let message = "An error occurred during sign up. Please try again.";
            if (err.code === 'auth/email-already-in-use') {
                message = "An account with this email already exists. Please log in.";
            } else if (err.code === 'auth/weak-password') {
                message = "Password is too weak. Please meet all the requirements.";
            }
            showUserFriendlyError(message);
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
            showUserFriendlyError("An error occurred with Google Sign-Up. Please try again.");
        }
    });
});