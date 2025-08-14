import { auth, provider } from "../firebase-init.js";

const loginBtn = document.getElementById('loginBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

if (!loginBtn || !googleLoginBtn || !emailInput || !passwordInput) {
  console.error("One or more elements are missing in the DOM!");
} else {
  loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) return alert("Email and password required!");

    try {
      await auth.signInWithEmailAndPassword(email, password);
      window.location.href = '/chrome-bias-detector-web/success';
    } catch (error) {
      alert(error.message);
    }
  });

  googleLoginBtn.addEventListener('click', async () => {
    try {
      await auth.signInWithPopup(provider);
      window.location.href = '/chrome-bias-detector-web/success';
    } catch (error) {
      alert(error.message);
    }
  });
}
