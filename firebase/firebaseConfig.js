import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB49odH5e_OVRS-Jkm86ZlXM9RSmr0jrto",
  authDomain: "superhero-73d40.firebaseapp.com",
  projectId: "superhero-73d40",
  storageBucket: "superhero-73d40.firebasestorage.app",
  messagingSenderId: "904298347099",
  appId: "1:904298347099:web:4edceb9c22d351df375d7e"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
