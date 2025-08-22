// forgot-password.js
import { auth } from './firebase-init.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const sendLinkBtn = document.getElementById('sendLinkBtn');
    const emailInput = document.getElementById('emailInput');
    const messageContainer = document.getElementById('message-container');
    const formContainer = document.getElementById('form-container');

    // Function to display messages to the user
    function showMessage(message, isError = false) {
        messageContainer.textContent = message;
        // Use the same error styles from your globals.css
        messageContainer.className = isError ? 'error-message' : 'success-message'; 
        
        // Quick styling for a success message since globals.css only has error styles
        if (!isError) {
            messageContainer.style.color = '#16a34a'; // A green color
            messageContainer.style.backgroundColor = 'oklch(0.8 0.1 145 / 20%)';
            messageContainer.style.border = '1px solid oklch(0.8 0.1 145 / 30%)';
            messageContainer.style.padding = '0.75rem';
            messageContainer.style.borderRadius = 'var(--radius)';
            messageContainer.style.textAlign = 'left';
        }
        
        messageContainer.style.display = 'block';
    }

    sendLinkBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        
        if (!email) {
            showMessage("Please enter your email address.", true);
            return;
        }

        try {
            // Disable the button to prevent multiple clicks
            sendLinkBtn.disabled = true;
            sendLinkBtn.textContent = 'Sending...';

            await sendPasswordResetEmail(auth, email);
            
            // Hide the form and show a success message
            formContainer.style.display = 'none';
            showMessage("Success! If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).");

        } catch (error) {
            let friendlyMessage = "An unexpected error occurred. Please try again.";
            // Firebase provides specific error codes we can check
            if (error.code === 'auth/invalid-email') {
                friendlyMessage = "The email address is not valid. Please check it and try again.";
            } else if (error.code === 'auth/user-not-found') {
                 // For security, we give a generic message even if the user is not found.
                 // This prevents people from checking which emails are registered.
                 formContainer.style.display = 'none';
                 showMessage("Success! If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).");
                 return; // Exit here to avoid re-enabling the button
            }
            
            showMessage(friendlyMessage, true);
        } finally {
            // Re-enable the button if an error occurred
            if (formContainer.style.display !== 'none') {
               sendLinkBtn.disabled = false;
               sendLinkBtn.textContent = 'Send Reset Link';
            }
        }
    });
});