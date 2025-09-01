// contact.js
import { auth } from '../firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const emailInput = document.getElementById("email");
  const formMessage = document.getElementById("form-message");
  const contactCard = document.getElementById("contact-card");

  // Feature: Pre-fill email for logged-in users
  onAuthStateChanged(auth, (user) => {
    if (user && emailInput) {
      emailInput.value = user.email;
    }
  });

  // Stop if the form doesn't exist on the page
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formMessage.style.display = 'none'; // Hide previous errors

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      reason: formData.get("reason"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("https://chrome-bias-detector-contact.vercel.app/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Feature: Replace page with a confirmation message on success
        contactCard.innerHTML = `
            <div class="card-header">
                <h2>Message Sent!</h2>
            </div>
            <div class="success-box">
                Thank you for reaching out. We will get back to you within 48 hours.
            </div>
            <a href="../" class="back-button">
              <svg style="width: 20px; height: 20px; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Home
            </a>
        `;
      } else {
        const data = await res.json().catch(() => ({ error: 'An unknown error occurred.' }));
        formMessage.textContent = "Error: " + data.error;
        formMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    } catch (err) {
      console.error(err);
      formMessage.textContent = "A network error occurred. Please try again later.";
      formMessage.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
});