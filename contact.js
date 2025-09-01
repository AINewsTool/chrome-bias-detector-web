// contact.js
import { auth } from '../firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const formMessage = document.getElementById("form-message");
  const emailInput = document.getElementById("email");
  const contactSection = document.querySelector(".contact-section");
  const contactContainer = document.querySelector(".contact-container");

  // Check for logged in user and pre-fill email
  onAuthStateChanged(auth, (user) => {
    if (user) {
      emailInput.value = user.email;
    }
  });

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `message ${type} show`;
    setTimeout(() => formMessage.classList.remove("show"), 5000);
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
        // Replace the form with a success message
        contactContainer.innerHTML = `
                <div class="contact-header">
                    <h1>Message Sent!</h1>
                    <p>Thank you for reaching out. We will get back to you within 48 hours.</p>
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