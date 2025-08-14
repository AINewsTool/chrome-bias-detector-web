// login.js
import { auth, provider } from "firebase-init.js";

document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const loginBtn = document.getElementById('loginBtn');
  const googleBtn = document.getElementById('googleBtn');
  const errorDiv = document.getElementById('authError');

  if (!emailInput || !passwordInput || !loginBtn || !googleBtn || !errorDiv) {
    console.error("One or more elements are missing in the DOM!");
    return;
  }

  loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    errorDiv.textContent = "";

    if (!email || !password) {
      errorDiv.textContent = "Email and password cannot be empty.";
      return;
    }

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      console.log("Firebase Token:", token);
      // Send token to extension via localStorage
      localStorage.setItem('firebaseToken', token);
      window.location.href = "success.html";
    } catch (error) {
      errorDiv.textContent = `Login failed: ${error.message}`;
    }
  });

  googleBtn.addEventListener('click', async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      const token = await result.user.getIdToken();
      localStorage.setItem('firebaseToken', token);
      window.location.href = "success.html";
    } catch (error) {
      errorDiv.textContent = `Google sign-in failed: ${error.message}`;
    }
  });
});
