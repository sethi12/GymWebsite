importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDFRhCXG4mGTLCzthZ7rCUGFzmAkRTtpG0",
  authDomain: "aigymcoach-1108e.firebaseapp.com",
  projectId: "aigymcoach-1108e",
  storageBucket: "aigymcoach-1108e.firebasestorage.app",
  messagingSenderId: "314772126662",
  appId: "1:314772126662:web:7365a3c6dfdb4ca0d190c7",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/next.svg",
  });
});