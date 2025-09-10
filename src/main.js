import { PushNotifications } from "@capacitor/push-notifications";

const initPush = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive !== "granted") {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive === "granted") {
    await PushNotifications.register();
  }

  PushNotifications.addListener("registration", (token) => {
    console.log("Push registration success, token: " + token.value);
  });

  PushNotifications.addListener("registrationError", (err) => {
    console.error("Push registration error: ", err.error);
  });

  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    console.log("Push received: ", notification);
  });
};

initPush();
