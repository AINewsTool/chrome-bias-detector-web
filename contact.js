// contact.js
import { auth } from '../firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const formMessage = document.getElementById("form-message");
  const emailInput = document.getElementById("email");
  const contactContainer = document.querySelector(".contact-container"); // The main container to replace

  // Pre-fill email for logged-in users
  onAuthStateChanged(auth, (user) => {
    if (user) {
      emailInput.value = user.email;
    }
  });

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `message ${type} show`;
    formMessage.style.display = 'block'; // Ensure it's visible
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

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
        // On success, replace the entire container with the new confirmation message
        contactContainer.innerHTML = `
            <div class="card-header" style="text-align: center;">
                <h2>Message Sent!</h2>
            </div>
            <div class="success-box">
                Thank you for your message! We'll get back to you within 48 hours.
            </div>
            <div style="text-align: center; margin-top: 1.5rem;">
                <a href="../" class="back-button">
                    <svg style="width: 20px; height: 20px; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Home
                </a>
            </div>
        `;
      } else {
        const { error } = await res.json();
        showMessage("Error sending message: " + error, "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    } catch (err) {
      console.error(err);
      showMessage("Network error, please try again later.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
});