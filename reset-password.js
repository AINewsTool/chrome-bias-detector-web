// reset-password.js
import { auth } from './firebase-init.js';
import { verifyPasswordResetCode, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async () => {
    const messageContainer = document.getElementById('message-container');
    const loaderContainer = document.getElementById('loader-container');
    const formContainer = document.getElementById('form-container');
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const subheading = document.getElementById('subheading');
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

    // --- Corrected Password strength checker logic ---
    newPasswordInput.addEventListener('input', () => {
        const password = newPasswordInput.value;
        const meetsLength = password.length >= 6;
        const meetsNumber = /\d/.test(password);

        // Toggle the 'valid' class based on whether criteria are met
        lengthReq.classList.toggle('valid', meetsLength);
        numberReq.classList.toggle('valid', meetsNumber);
    });

    // --- Corrected Password update logic ---
    savePasswordBtn.addEventListener('click', async () => {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // --- Stricter Validation ---
        // Checks if the checklist items have the 'valid' class.
        const isLengthValid = lengthReq.classList.contains('valid');
        const isNumberValid = numberReq.classList.contains('valid');

        if (!isLengthValid || !isNumberValid) {
            showMessage("Password does not meet all requirements.", true);
            return; // This now correctly stops the submission
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