import { boot } from "quasar/wrappers";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";

export default boot(async () => {
  console.log("Boot push-permission started");

  try {
    const permStatus = await FirebaseMessaging.requestPermissions();
    console.log("Push permissions:", permStatus);

    if (permStatus.receive === "granted") {
      const { token } = await FirebaseMessaging.getToken();
      console.log("FCM Token:", token);
    }
  } catch (err) {
    console.error("Push permission error:", err);
  }
});
