import { auth, provider } from "./firebase-init.js";

// --- Elements ---
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const googleBtn = document.getElementById("googleSignupBtn");
const errorDiv = document.getElementById("signupError");

// --- Helpers ---
async function sendTokenToExtension(user) {
  try {
    const idToken = await user.getIdToken();
    chrome.runtime.sendMessage({ action: "setUserToken", token: idToken });
  } catch (err) {
    console.error("Error sending token to extension:", err);
  }
}

// --- Email/Password Signup ---
signupBtn.addEventListener("click", async () => {
  errorDiv.textContent = "";
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    errorDiv.textContent = "Email and password are required.";
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = "Password must be at least 6 characters long.";
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await sendTokenToExtension(user);
    window.location.href = "/success";
  } catch (err) {
    console.error(err);
    errorDiv.textContent = `Signup failed: ${err.message}`;
  }
});

// --- Google Signup ---
googleBtn.addEventListener("click", async () => {
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    await sendTokenToExtension(user);
    window.location.href = "../success";
  } catch (err) {
    console.error(err);
    errorDiv.textContent = `Google signup failed: ${err.message}`;
  }
});
