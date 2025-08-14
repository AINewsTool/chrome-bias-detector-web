// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB07avalIpRbiwFjOqSguaoxS4lRswNl_U",
  authDomain: "biasdetectorextension.firebaseapp.com",
  projectId: "biasdetectorextension",
  storageBucket: "biasdetectorextension.firebasestorage.app",
  messagingSenderId: "664962798895",
  appId: "1:664962798895:web:81f296bfec93bb7c603dda",
  measurementId: "G-L7JM0N01MM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
