import { PushNotifications } from "@capacitor/push-notifications";
import { useUserStore } from "src/stores/userStore";

const initPush = async () => {
  const userStore = useUserStore();

  console.log("🚀 Инициализация push-уведомлений...");

  let permStatus = await PushNotifications.checkPermissions();
  console.log("📋 Текущий статус разрешений:", permStatus);

  if (permStatus.receive !== "granted") {
    permStatus = await PushNotifications.requestPermissions();
    console.log("🔄 Запрос разрешений:", permStatus);
  }

  if (permStatus.receive === "granted") {
    console.log("✅ Разрешения получены, регистрируем push...");
    await PushNotifications.register();
  } else {
    console.warn("❌ Уведомления не разрешены пользователем");
    return;
  }

  // Событие: успешная регистрация
  PushNotifications.addListener("registration", async (token) => {
    console.log("🎯 Push registration success, token:", token.value);

    if (userStore.userId) {
      try {
        await userStore.saveFCMToken(userStore.userId, token.value);
        console.log("💾 Токен сохранён в Firestore");
      } catch (err) {
        console.error("🔥 Ошибка при сохранении токена в Firestore:", err);
      }
    } else {
      console.warn("⚠️ Пользователь не авторизован, токен не сохранён");
    }
  });

  // Событие: ошибка регистрации
  PushNotifications.addListener("registrationError", (err) => {
    console.error("🚨 Push registration error:", err.error);
  });

  // Событие: получение уведомления в активном приложении
  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    console.log("🔔 Push получен в активном приложении:", notification);
  });

  // Событие: взаимодействие с уведомлением (тап)
  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification) => {
      console.log("👉 Пользователь тапнул по уведомлению:", notification);
    }
  );
};

initPush();
