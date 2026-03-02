// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyCaCtYv6CmMnaezDMQC-zX1jAd7yf5Hovk",
  authDomain: "usefilters-reviews.firebaseapp.com",
  projectId: "usefilters-reviews",
  storageBucket: "usefilters-reviews.firebasestorage.app",
  messagingSenderId: "727855904537",
  appId: "1:727855904537:web:9609331078b53cf390f788"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export database
export { db };


console.log("Firebase connected:", db);