//firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6T9PphRMXO6weukYreLLTL_jTFrvm90c",
  authDomain: "myexpensetracker012.firebaseapp.com",
  projectId: "myexpensetracker012",
  storageBucket: "myexpensetracker012.appspot.com",
  messagingSenderId: "132972244029",
  appId: "1:132972244029:web:031b494af4729b8a478e54"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
})

export { auth, googleProvider, db };
