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
    const cardElement = document.querySelector('.card');
    const backButton = document.querySelector('.back-button');

    const lengthReq = document.getElementById('length-req');
    const numberReq = document.getElementById('number-req');
    const specialReq = document.getElementById('special-req');

    function showUserFriendlyError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

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
            const providerId = user.providerData[0]?.providerId;

            if (chrome && chrome.runtime) {
                chrome.runtime.sendMessage(
                    EXTENSION_ID, 
                    { type: "LOGIN_SUCCESS", token: token, email: email, providerId: providerId }, 
                    () => {}
                );
            }
        }
        
        // **FIX:** Hide the back button because it's outside the card
        if (backButton) {
            backButton.style.display = 'none';
        }

        const message = isNewUser ? "Account Created!" : "Login Successful!";
        
        // This correctly replaces the card content with the success message
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
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            if (countdown <= 0) {
                clearInterval(interval);
                window.location.href = '../'; 
            }
        }, 1000);
    }

    // Email/Password Sign Up
    signupEmailBtn.addEventListener('click', async () => {
        errorContainer.style.display = 'none';

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