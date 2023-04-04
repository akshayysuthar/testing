
// Handle form submission to add a new movie review to Firebase


const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

      // Get the form data
      const link1080p = document.getElementById("link1080p").value;
      const link720p = document.getElementById("link720p").value;
      const postId = document.getElementById("postId").value;
  
db.collection('telegram-post').doc(postId).set({

        link1080p,
        link720p,
        timestamp: Date(),
      });
    })


