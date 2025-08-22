// reset-password.js
import { auth } from './firebase-init.js';
import { verifyPasswordResetCode, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async () => {
    // Get all necessary elements from the page
    const messageContainer = document.getElementById('message-container');
    const loaderContainer = document.getElementById('loader-container');
    const formContainer = document.getElementById('form-container');
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const subheading = document.getElementById('subheading');

    // --- New: Get strength checker elements ---
    const lengthReq = document.getElementById('length-req');
    const numberReq = document.getElementById('number-req');

    function showMessage(message, isError = false) {
        messageContainer.textContent = message;
        messageContainer.className = isError ? 'error-message' : 'success-message';
        messageContainer.style.display = 'block';
    }

    const params = new URLSearchParams(window.location.search);
    const actionCode = params.get('oobCode');

    if (!actionCode) {
        loaderContainer.style.display = 'none';
        showMessage("No reset code provided. The link may be incorrect.", true);
        return;
    }

    try {
        const email = await verifyPasswordResetCode(auth, actionCode);
        loaderContainer.style.display = 'none';
        formContainer.style.display = 'block';
        subheading.textContent = `Enter a new password for ${email}`;
    } catch (error) {
        loaderContainer.style.display = 'none';
        showMessage("This password reset link is invalid or has expired. Please request a new one.", true);
        return;
    }

    // --- New: Password strength checker logic ---
    newPasswordInput.addEventListener('input', () => {
        const password = newPasswordInput.value;

        // Check for length
        if (password.length >= 6) {
            lengthReq.classList.add('valid');
        } else {
            lengthReq.classList.remove('valid');
        }

        // Check for a number
        if (/\d/.test(password)) {
            numberReq.classList.add('valid');
        } else {
            numberReq.classList.remove('valid');
        }
    });


    // --- Handle the password update ---
    savePasswordBtn.addEventListener('click', async () => {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validation now checks the same requirements as the strength checker
        if (newPassword.length < 6 || !/\d/.test(newPassword)) {
            showMessage("Password does not meet all requirements.", true);
            return;
        }
        if (newPassword !== confirmPassword) {
            showMessage("Passwords do not match.", true);
            return;
        }

        try {
            savePasswordBtn.disabled = true;
            savePasswordBtn.textContent = 'Saving...';
            
            await confirmPasswordReset(auth, actionCode, newPassword);

            formContainer.style.display = 'none';
            subheading.style.display = 'none';
            showMessage("Your password has been updated successfully! You can now log in with your new password.");

            const loginLink = document.createElement('a');
            loginLink.href = '../login/';
            loginLink.textContent = 'Go to Login';
            loginLink.className = 'primary';
            loginLink.style.textDecoration = 'none';
            loginLink.style.display = 'block';
            loginLink.style.textAlign = 'center';
            loginLink.style.marginTop = '1rem';
            messageContainer.appendChild(loginLink);

        } catch (error) {
            let friendlyMessage = "An error occurred. Please try again.";
            if (error.code === 'auth/weak-password') {
                friendlyMessage = "Password is too weak according to Firebase's standards.";
            }
            showMessage(friendlyMessage, true);

            savePasswordBtn.disabled = false;
            savePasswordBtn.textContent = 'Save New Password';
        }
    });
});