
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const reviewId = document.body.dataset.reviewId;

// =========================
// RATING SYSTEM
// =========================
const ratingSelect = document.getElementById("userRating");
const averageElement = document.getElementById("averageScore");
const averageContainer = document.querySelector(".average-rating");
const messageElement = document.getElementById("ratingMessage");
const yourRatingElement = document.getElementById("yourRating");

if (ratingSelect) {
  const storageKey = "voted-" + reviewId;
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

    const value = Number(ratingSelect.value);
    if (!ratingSelect.value) return;

    const validScores = [
      5, 5.5, 6, 6.5, 7, 7.5,
      8, 8.5, 9, 9.5, 10
    ];

    if (!validScores.includes(value)) {
      if (messageElement) {
        messageElement.textContent = "Invalid rating.";
      }
      return;
    }

    ratingSelect.disabled = true;

    try {
      await addDoc(
        collection(db, "reviews", reviewId, "ratings"),
        {
          score: value,
          createdAt: serverTimestamp()
        }
      );

      localStorage.setItem(storageKey, String(value));

      if (yourRatingElement) {
        yourRatingElement.textContent = "Your rating: " + value;
      }

      if (messageElement) {
        messageElement.textContent = "Thanks for rating.";
      }
    } catch (error) {
      console.error("Error saving rating:", error);

      ratingSelect.disabled = false;

      if (messageElement) {
        messageElement.textContent =
          "Could not save your rating. Please try again.";
      }
    }
  });
}

// =========================
// REALTIME AVERAGE
// =========================
if (averageElement) {
  const ratingsRef = collection(
    db, "reviews", reviewId, "ratings"
  );

  onSnapshot(
    ratingsRef,
    (snapshot) => {
      let total = 0;
      let count = 0;

      snapshot.forEach((ratingDoc) => {
        const score = ratingDoc.data().score;

        if (typeof score === "number") {
          total += score;
          count++;
        }
      });

      if (count === 0) {
        averageElement.textContent = "No ratings yet";
        return;
      }

      const average = total / count;
      const displayAverage = () => {
        averageElement.textContent =
          `${average.toFixed(1)} / 10 (${count} ratings)`;

        averageContainer?.classList.remove("animate");
      };

      if (averageContainer) {
        averageContainer.classList.add("animate");
        setTimeout(displayAverage, 150);
      } else {
        displayAverage();
      }
    },
    (error) => {
      console.error("Error loading ratings:", error);
      averageElement.textContent = "Unable to load ratings";
    }
  );
}

// =========================
// COMMENTS
// =========================
const commentForm = document.getElementById("commentForm");
const commentName = document.getElementById("commentName");
const commentText = document.getElementById("commentText");
const commentSubmit = document.getElementById("commentSubmit");
const commentMessage = document.getElementById("commentMessage");
const commentsList = document.getElementById("commentsList");
const commentsSummary = document.getElementById("commentsSummary");

const commentsRef = collection(
  db, "reviews", reviewId, "comments"
);

if (commentForm && commentsList && commentsSummary) {
  // Display newest comments first.
  const commentsQuery = query(
    commentsRef,
    orderBy("createdAt", "desc")
  );

  onSnapshot(
    commentsQuery,
    (snapshot) => {
      commentsList.replaceChildren();

      commentsSummary.textContent =
        `View comments (${snapshot.size})`;

      if (snapshot.empty) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No comments yet. Be the first!";
        commentsList.appendChild(emptyMessage);
        return;
      }

      snapshot.forEach((commentDoc) => {
        const data = commentDoc.data();

        const paragraph = document.createElement("p");
        const author = document.createElement("strong");
        const body = document.createElement("span");

        author.textContent = `${data.name || "Listener"}: `;
        body.textContent = data.text || "";

        paragraph.append(author, body);
        commentsList.appendChild(paragraph);
      });
    },
    (error) => {
      console.error("Error loading comments:", error);
      commentsSummary.textContent = "View comments";
      commentsList.textContent = "Unable to load comments.";
    }
  );

  commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = commentName.value.trim();
    const text = commentText.value.trim();

    if (!name || !text) {
      commentMessage.textContent =
        "Please enter your name and comment.";
      return;
    }

    if (name.length > 40 || text.length > 1000) {
      commentMessage.textContent =
        "Your name or comment is too long.";
      return;
    }

    commentSubmit.disabled = true;
    commentMessage.textContent = "Publishing comment...";

    try {
      await addDoc(commentsRef, {
        name,
        text,
        createdAt: serverTimestamp()
      });

      commentText.value = "";
      commentMessage.textContent = "Your comment has been published.";
    } catch (error) {
      console.error("Error publishing comment:", error);

      commentMessage.textContent =
        "Could not publish your comment. Please try again.";
    } finally {
      commentSubmit.disabled = false;
    }
  });
}

export { db };
