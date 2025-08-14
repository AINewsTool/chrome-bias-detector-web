// Make sure your HTML uses <script type="module" src="/login.js"></script>
import { auth, provider } from "./firebase-init.js";
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const googleBtn = document.getElementById('googleLoginBtn');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');

  if (!loginBtn || !googleBtn || !emailInput || !passwordInput) {
    console.error("One or more elements are missing in the DOM!");
    return;
  }

  loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      console.log("Firebase token:", token); // Send this to your extension as needed
      window.location.href = "/success"; // Redirect after login
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  });

  googleBtn.addEventListener('click', async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      console.log("Firebase token (Google):", token); // Send this to your extension as needed
      window.location.href = "/success";
    } catch (error) {
      console.error("Google login error:", error);
      alert(error.message);
    }
  });
});
