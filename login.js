import { auth, provider } from "./firebase-init.js";

// --- Elements ---
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const googleBtn = document.getElementById("googleLoginBtn");
const errorDiv = document.getElementById("loginError");

// --- Helpers ---
async function sendTokenToExtension(user) {
  try {
    const idToken = await user.getIdToken();
    chrome.runtime.sendMessage({ action: "setUserToken", token: idToken });
  } catch (err) {
    console.error("Error sending token to extension:", err);
  }
}

// --- Email/Password Login ---
loginBtn.addEventListener("click", async () => {
  errorDiv.textContent = "";
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    errorDiv.textContent = "Email and password are required.";
    return;
  }

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await sendTokenToExtension(user);
    window.location.href = "../success";
  } catch (err) {
    console.error(err);
    errorDiv.textContent = `Login failed: ${err.message}`;
  }
});

// --- Google Login ---
googleBtn.addEventListener("click", async () => {
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    await sendTokenToExtension(user);
    window.location.href = "../success";
  } catch (err) {
    console.error(err);
    errorDiv.textContent = `Google login failed: ${err.message}`;
  }
});
