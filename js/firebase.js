// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBDWDjrEOFGltyphe8_ypLdKKjIVtEJ9r4",
    authDomain: "server-98ae7.firebaseapp.com",
    databaseURL:
      "https://server-98ae7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "server-98ae7",
    storageBucket: "server-98ae7.appspot.com",
    messagingSenderId: "720177014991",
    appId: "1:720177014991:web:f5b143cff4f3773051afba",
    measurementId: "G-KC369EY357",
  };
  firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();