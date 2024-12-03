// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKi3owg3WD6FlApyftqLsl0LEadGYM7Yk",
  authDomain: "my-comment-d816f.firebaseapp.com",
  databaseURL: "https://my-comment-d816f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-comment-d816f",
  storageBucket: "my-comment-d816f.firebasestorage.app",
  messagingSenderId: "444552815409",
  appId: "1:444552815409:web:2955f355d76f296bd88610",
  measurementId: "G-143RDLHH60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Realtime Database
const database = getDatabase(app);

// Get the form and comments section elements
const form = document.getElementById('contactForm');
const commentsList = document.getElementById('commentsList');

// Add an event listener to handle form submission
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form from refreshing the page

  // Get input values
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  // Validate inputs
  if (!fullName || !email || !message) {
    alert('Please fill out all required fields.');
    return;
  }

  // Create a new comment object
  const commentData = {
    fullName,
    email,
    subject,
    message,
    timestamp: Date.now()
  };

  // Save the comment to Firebase
  const commentsRef = ref(database, 'comments');
  push(commentsRef, commentData).then(() => {
    alert('Comment saved successfully!');
    form.reset();
    loadComments(); // Refresh comments
  }).catch((error) => {
    console.error('Error saving comment: ', error);
  });
});

// Load Comments from Firebase
const loadComments = () => {
  const commentsList = document.getElementById('commentsList');
  commentsList.innerHTML = ''; // Clear existing comments

  const commentsRef = ref(database, 'comments');
  get(commentsRef).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const comment = childSnapshot.val();
        const commentItem = document.createElement('li');
        commentItem.classList.add('comment-text');
        commentItem.innerHTML = `
          <strong>${comment.fullName} (${comment.email})</strong>
          <p><strong>Subject:</strong> ${comment.subject}</p>
          <p><strong>Message:</strong> ${comment.message}</p>
        `;
        commentsList.appendChild(commentItem);
      });
    } else {
      commentsList.innerHTML = '<li>No comments available.</li>';
    }
  }).catch((error) => {
    console.error('Error loading comments: ', error);
  });
};

// Load comments on page load
window.onload = loadComments;
