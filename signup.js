import { auth, provider } from "../firebase-init.js";

const signupBtn = document.getElementById('signupBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

if (!signupBtn || !googleSignupBtn || !emailInput || !passwordInput) {
  console.error("One or more elements are missing in the DOM!");
} else {
  signupBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) return alert("Email and password required!");
    if (password.length < 6) return alert("Password must be at least 6 characters");

    try {
      await auth.createUserWithEmailAndPassword(email, password);
      window.location.href = 'https://ainewstool.github.io/chrome-bias-detector-web/success';
    } catch (error) {
      alert(error.message);
    }
  });

  googleSignupBtn.addEventListener('click', async () => {
    try {
      await auth.signInWithPopup(provider);
      window.location.href = 'https://ainewstool.github.io/chrome-bias-detector-web/success';
    } catch (error) {
      alert(error.message);
    }
  });
}
