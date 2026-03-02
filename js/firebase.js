// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
  collection, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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


const reviewId = "autechre-elseq";

const ratingSelect = document.getElementById("userRating");

if (ratingSelect) {
  ratingSelect.addEventListener("change", async () => {
    const value = ratingSelect.value;

    if (!value) return;

    try {
      await addDoc(
        collection(db, "reviews", reviewId, "ratings"),
        {
          score: parseFloat(value),
          createdAt: new Date()
        }
      );

      console.log("Rating saved:", value);

    } catch (error) {
      console.error("Error saving rating:", error);
    }
  });
}

// Export database
export { db };


console.log("Firebase connected:", db);