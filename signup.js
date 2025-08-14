// signup.js
import { auth, provider } from "./firebase-init.js";

document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const signupBtn = document.getElementById('signupBtn');
  const googleBtn = document.getElementById('googleBtn');
  const errorDiv = document.getElementById('authError');

  if (!emailInput || !passwordInput || !signupBtn || !googleBtn || !errorDiv) {
    console.error("One or more elements are missing in the DOM!");
    return;
  }

  signupBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    errorDiv.textContent = "";

    if (!email || !password) {
      errorDiv.textContent = "Email and password cannot be empty.";
      return;
    }

    if (password.length < 6) {
      errorDiv.textContent = "Password must be at least 6 characters.";
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseToken', token);
      window.location.href = "../success/";
    } catch (error) {
      errorDiv.textContent = `Sign-up failed: ${error.message}`;
    }
  });

  googleBtn.addEventListener('click', async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      const token = await result.user.getIdToken();
      localStorage.setItem('firebaseToken', token);
      window.location.href = "../success/";
    } catch (error) {
      errorDiv.textContent = `Google sign-in failed: ${error.message}`;
    }
  });
});
