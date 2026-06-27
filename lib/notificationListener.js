import app from "./firebase";
import { getMessaging, onMessage } from "firebase/messaging";

export const initializeForegroundNotifications = () => {
  const messaging = getMessaging(app);

  onMessage(messaging, (payload) => {
    console.log("Foreground Notification:", payload);

    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/next.svg",
      });
    }
  });
};