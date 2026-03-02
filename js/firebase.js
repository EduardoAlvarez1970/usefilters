// =========================
// IMPORTS
// =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore,
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =========================
// FIREBASE CONFIG
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyCaCtYv6CmMnaezDMQC-zX1jAd7yf5Hovk",
  authDomain: "usefilters-reviews.firebaseapp.com",
  projectId: "usefilters-reviews",
  storageBucket: "usefilters-reviews.firebasestorage.app",
  messagingSenderId: "727855904537",
  appId: "1:727855904537:web:9609331078b53cf390f788"
};


// =========================
// INITIALIZE FIREBASE
// =========================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// =========================
// DOM ELEMENTS
// =========================
const reviewId = "autechre-elseq";
const ratingSelect = document.getElementById("userRating");
const averageElement = document.getElementById("averageScore");
const averageContainer = document.querySelector(".average-rating");
const messageElement = document.getElementById("ratingMessage");
const yourRatingElement = document.getElementById("yourRating");


// =========================
// RATING SYSTEM
// =========================
if (ratingSelect) {

  const storageKey = "voted-" + reviewId;

  // If user already voted
  const savedValue = localStorage.getItem(storageKey);

  if (savedValue) {
    ratingSelect.disabled = true;
    ratingSelect.value = savedValue;

    if (yourRatingElement) {
      yourRatingElement.textContent = "Your rating: " + savedValue;
    }

    if (messageElement) {
      messageElement.textContent = "Thanks for rating.";
    }
  }

  ratingSelect.addEventListener("change", async () => {

    if (localStorage.getItem(storageKey)) return;

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

      localStorage.setItem(storageKey, value);
      ratingSelect.disabled = true;

      if (yourRatingElement) {
        yourRatingElement.textContent = "Your rating: " + value;
      }

      if (messageElement) {
        messageElement.textContent = "Thanks for rating.";
      }

      console.log("Rating saved:", value);

    } catch (error) {
      console.error("Error saving rating:", error);
    }

  });
}


// =========================
// REALTIME AVERAGE
// =========================
if (averageElement) {

  const ratingsRef = collection(db, "reviews", reviewId, "ratings");

  onSnapshot(ratingsRef, (snapshot) => {

    let total = 0;
    let count = 0;

    snapshot.forEach((doc) => {
      total += doc.data().score;
      count++;
    });

    if (count === 0) {
      averageElement.textContent = "No ratings yet";
      return;
    }

    const average = total / count;

    if (averageContainer) {

      averageContainer.classList.add("animate");

      setTimeout(() => {

        averageElement.textContent =
          average.toFixed(1) + " / 10 (" + count + " ratings)";

        averageContainer.classList.remove("animate");

      }, 150);

    } else {
      averageElement.textContent =
        average.toFixed(1) + " / 10 (" + count + " ratings)";
    }

  });

}


// =========================
// EXPORT
// =========================
export { db };