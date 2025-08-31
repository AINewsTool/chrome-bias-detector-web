// contact.js
import { auth, db } from './firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    // --- Pre-fill email for logged-in users ---
    onAuthStateChanged(auth, (user) => {
        if (user && user.email) {
            emailInput.value = user.email;
        }
    });

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `message ${type} show`;
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }

    // --- Handle Form Submission ---
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const reason = formData.get('reason');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !reason || !message) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Save the form data to the "contact_submissions" collection in Firestore
            await addDoc(collection(db, "contact_submissions"), {
                to: 'truscope.help@gmail.com', // Your support email
                replyTo: email,
                message: {
                  subject: `Contact Form: ${reason} from ${name}`,
                  html: `
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Reason:</strong> ${reason}</p>
                    <hr>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                  `,
                },
                createdAt: serverTimestamp()
            });

            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            contactForm.reset();

        } catch (error) {
            console.error("Error writing document to Firestore: ", error);
            showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
});