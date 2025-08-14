import { auth, provider } from "./firebase-init.js";
import { createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const signupBtn = document.getElementById('signupBtn');
  const googleBtn = document.getElementById('googleSignupBtn');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');

  if (!signupBtn || !googleBtn || !emailInput || !passwordInput) {
    console.error("One or more elements are missing in the DOM!");
    return;
  }

  signupBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      console.log("Firebase token (Signup):", token);
      window.location.href = "/success";
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }
  });

  googleBtn.addEventListener('click', async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      console.log("Firebase token (Google Signup):", token);
      window.location.href = "/success";
    } catch (error) {
      console.error("Google signup error:", error);
      alert(error.message);
    }
  });
});
