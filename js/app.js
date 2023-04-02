function startCountdown() {
  var countdownEl = document.getElementById("countdown");
  var countdownBtn = document.getElementById("countdown-btn");
  var continueBtn = document.getElementById("continue-btn");
  var timeLeft = 1;
  countdownBtn.style.display = "none";
  continueBtn.style.display = "none";
  var countdownInterval = setInterval(function () {
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      countdownEl.innerHTML = "Scroll down and click on continue button";
      continueBtn.style.display = "block";
    } else {
      countdownEl.innerHTML = "PLease wait " + timeLeft + " seconds";
    }
    timeLeft -= 1;
  }, 1000);
}
function continueBtn() {
  var countdownEl = document.getElementById("countdown1");
  var countdownBtn = document.getElementById("countdown-btn");
  var continueBtn = document.getElementById("continue-btn");
  var linkDiv = document.getElementById("linkDiv");
  var timeLeft = 1;
  countdownBtn.style.display = "none";
  continueBtn.style.display = "none";
  var countdownInterval = setInterval(function () {
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      linkDiv.innerHTML += `<button onclick="openpostPage()" style="display: block;">Continue</button>`;
      continueBtn.style.display = "none";
      countdownEl.style.display = "none";
    } else {
      countdownEl.innerHTML = "PLease Wait " + timeLeft + " seconds";
    }
    timeLeft -= 1;
  }, 1000);
}
function continueBtn2() {
  var countdownEl = document.getElementById("countdown2");
  var countdownBtn = document.getElementById("countdown-btn");
  var continueBtn = document.getElementById("continue-btn");
  var linkDiv = document.getElementById("linkDiv");
  var timeLeft = 1;
  countdownBtn.style.display = "none";
  continueBtn.style.display = "none";
  var countdownInterval = setInterval(function () {
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      continueBtn.style.display = "none";
      countdownEl.style.display = "none";
      linkDiv.style.display ="block";
    } else {
      countdownEl.innerHTML = "PLease Wait " + timeLeft + " seconds";
    }
    timeLeft -= 1;
  }, 1000);
}

const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get("id");
// var type = new URLSearchParams(window.location.search).get("type");
var movie = new URLSearchParams(window.location.search).get("movie");

function openpostPage(blogId) {
  window.location.href = `blog1.html?movie=${movie}&type=${type}`;
}


// db.collection("telegram-post")
//   .doc(movie)
//   .get()
//   .then((doc) => {
//     function getlink (type) {
//       if (type == "720p") {
//         console.log(data.link720p)
//       }
//       else {
//         console.log(doc.data().link1080p)
//       }
//     }

//   });

// const query = db.collection("blogs").limit(1)

// query.get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     // Do something with the blog data
//     document.getElementById("article").innerHTML += `${doc.data().article}`
//     document.getElementById("title").innerHTML += `${doc.data().title}`
//     document.getElementById("tab-title").innerHTML += `${doc.data().title}`
//   });
// }).catch((error) => {
//   console.log("Error getting documents: ", error);
// });

// Get the type value from the URL query string
// const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");

// Get a reference to the Firestore collection for blogs
const blogsRef = db.collection("blogs").doc(movie);

// Query the collection for a document with the specified type value
db.collection("telegram-post")
  .doc(movie)
  .get()
  .then((doc) => {
    if (doc.exists) {
      const movieData = doc.data();
      // Get the link value for the specified type from the movie data
      const link = movieData[`link${type}`];
      // Create a link element with the specified link value
      const linkElement = document.createElement("a");
      linkElement.href = link;
      linkElement.className = "linkDiv"
      linkElement.textContent = "Read more";
      // Add the link element to the linkDiv element on the web page
      const linkDiv = document.getElementById("linkDiv");
      linkDiv.style.display ="none";
      linkDiv.appendChild(linkElement);
    } else {
      console.log("No such movie!");
    }
  })
  .catch((error) => {
    console.log("Error getting movie:", error);
  });
