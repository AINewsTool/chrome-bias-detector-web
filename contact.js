// contact.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const formMessage = document.getElementById("form-message");

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
        showMessage("Thank you for your message! We'll get back to you soon.", "success");
        form.reset();
      } else {
        const { error } = await res.json();
        showMessage("Error sending message: " + error, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Network error, please try again later.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
});
