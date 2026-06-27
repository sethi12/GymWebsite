import app from "./firebase";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

export const getFCMToken = async () => {
  try {
    // Check if browser supports FCM
    const supported = await isSupported();

    if (!supported) {
      console.log("Firebase Messaging is not supported in this browser.");
      return null;
    }

    // Register the service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const messaging = getMessaging(app);

    // Get FCM Token
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    }

    console.log("No registration token available.");
    return null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};