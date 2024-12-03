let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top <= offset + height) {  // Fixed the comparison
            navLinks.forEach(link => {
                link.classList.remove('active');
                document.querySelector(`header nav a[href*='${id}']`).classList.add('active');
            });
        }
    });
};

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

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

    // Create a new comment item for the DOM (this is temporary)
    const commentItem = document.createElement('li');
    commentItem.classList.add('comment-text');
    commentItem.innerHTML = `
        <strong>${fullName} (${email})</strong>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <button class="deleteBtn">Delete</button>
    `;

    // Add event listener to the delete button
    const deleteBtn = commentItem.querySelector('.deleteBtn');
    deleteBtn.addEventListener('click', () => {
        commentsList.removeChild(commentItem);
        // Here we should also delete it from Firebase, I'll explain below
    });

    // Append the comment to the list
    commentsList.appendChild(commentItem);

    // Save comment to Firebase
    const commentData = {
        fullName,
        email,
        subject,
        message,
        timestamp: Date.now()
    };

    // Save comment to Firebase database
    firebase.database().ref('comments').push(commentData).then(() => {
        alert('Comment saved successfully!');
        form.reset();
        loadComments(); // Refresh comments after saving
    });
});

// Load Comments from Firebase
const loadComments = () => {
    commentsList.innerHTML = ''; // Clear existing comments
    firebase.database().ref('comments').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const comment = childSnapshot.val();
            const commentItem = document.createElement('li');
            commentItem.classList.add('comment-text');
            commentItem.innerHTML = `
                <strong>${comment.fullName} (${comment.email})</strong>
                <p><strong>Subject:</strong> ${comment.subject}</p>
                <p><strong>Message:</strong> ${comment.message}</p>
                <button class="deleteBtn">Delete</button>
            `;
            commentsList.appendChild(commentItem);

            // Add delete button event listener for Firebase
            const deleteBtn = commentItem.querySelector('.deleteBtn');
            deleteBtn.addEventListener('click', () => {
                // Remove from DOM
                commentsList.removeChild(commentItem);

                // Delete from Firebase
                firebase.database().ref('comments').child(childSnapshot.key).remove();
            });
        });
    });
};

// Load comments on page load
window.onload = loadComments;
