import { PushNotifications } from "@capacitor/push-notifications";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import firebaseApp from "./firebase";

const db = getFirestore(firebaseApp);

/**
 * Сохраняет FCM-токен в Firestore (в массив fcmTokens).
 */
export async function saveFCMToken(userId, token) {
  if (!userId || !token) return;
  try {
    const userRef = doc(db, "users", userId, "ProfileInfo", "main");
    await updateDoc(userRef, {
      fcmTokens: arrayUnion(token),
    });
    console.log("✅ Токен сохранён в Firestore:", token);
  } catch (error) {
    console.error("❌ Ошибка при сохранении FCM-токена:", error);
  }
}

/**
 * Удаляет FCM-токен из Firestore (если он недействителен).
 */
export async function removeFCMToken(userId, token) {
  if (!userId || !token) return;
  try {
    const userRef = doc(db, "users", userId, "ProfileInfo", "main");
    await updateDoc(userRef, {
      fcmTokens: arrayRemove(token),
    });
    console.log("🗑️ Удалён недействительный токен:", token);
  } catch (error) {
    console.error("❌ Ошибка при удалении FCM-токена:", error);
  }
}

/**
 * Запрашивает разрешение на уведомления и регистрирует FCM-токен через Capacitor.
 * @param {string} userId - ID пользователя
 */
export async function requestFCMPermission(userId) {
  try {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive !== "granted") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive === "granted") {
      await PushNotifications.register();

      PushNotifications.addListener("registration", async (token) => {
        console.log("📲 Push registration success, token:", token.value);
        await saveFCMToken(userId, token.value);
      });

      PushNotifications.addListener("registrationError", (err) => {
        console.error("❌ Push registration error:", err.error);
      });

      return true;
    } else {
      console.warn("❌ Разрешение на пуш-уведомления не выдано");
      return false;
    }
  } catch (error) {
    console.error("Ошибка при запросе разрешения на пуши:", error);
    return false;
  }
}

/**
 * Подписывается на уведомления в активном состоянии приложения.
 */
export function listenFCMMessages(callback) {
  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    console.log("🔔 Получено уведомление:", notification);
    callback(notification);
  });
}
