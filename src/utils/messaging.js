import {
  // getMessaging,
  getToken,
  onMessage,
  deleteToken,
} from "firebase/messaging";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import firebaseApp from "./firebase";

const VAPID_KEY =
  "BDYkhdsevukfsrIPM5iT0zPZp0aULZHFm7kzZsfnqtBYkeQoudMAGNDsNPlNj4kHcufJ2R9xlKt-lS1IzIOkxck";

// const messaging = getMessaging(firebaseApp);
const db = getFirestore(firebaseApp);

/**
 * Сохраняет FCM-токен в Realtime Database.
 * Токен сохраняется по пути: users/{uid}/fcmTokens/{token} = true
 */
async function saveFCMToken(userId, token) {
  const userRef = doc(db, "users", userId, "ProfileInfo", "main");
  await updateDoc(userRef, {
    fcmTokens: arrayUnion(token),
  });
  console.log("✅ Токен сохранён в Firestore:", token);
}

/**
 * Удаляет FCM-токен из Realtime Database.
 */
export async function removeFCMToken(userId, token) {
  const userRef = doc(db, "users", userId, "ProfileInfo", "main");
  await updateDoc(userRef, {
    fcmTokens: arrayRemove(token),
  });
  console.log("🗑️ Удалён недействительный токен:", token);
}

/**
 * Запрашивает разрешение на уведомления и регистрирует FCM-токен.
 * @param {string} userId - ID пользователя
 * @param {string} [token] - FCM-токен (опционально, если передан из Capacitor)
 */
export async function requestFCMPermission(userId, token = null) {
  try {
    if (token) {
      // Если токен передан (например, из Capacitor), сохраняем его
      await saveFCMToken(userId, token);
      return true;
    }

    // Веб-логика для получения токена
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Разрешение на уведомления не предоставлено");
      if (/Android/i.test(navigator.userAgent)) {
        alert(
          "Уведомления отключены. Пожалуйста, включите их в настройках устройства: Настройки > Приложения > Yo Bro > Уведомления."
        );
      }
      return false;
    }

    const newToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (newToken) {
      console.log("FCM-токен:", newToken);
      await saveFCMToken(userId, newToken);
      return true;
    } else {
      console.warn("⚠️ Не удалось получить FCM-токен");
      return false;
    }

    // Сохраняем токен
    await saveFCMToken(uid, token);
    return true;
  } catch (error) {
    console.error("Ошибка при запросе разрешения на пуши:", error);
    return false;
  }
}

/**
 * Подписывается на получение уведомлений в активном состоянии.
 */
export function listenFCMMessages(callback) {
  onMessage(messaging, (payload) => {
    console.log("🔔 Получено уведомление в активном состоянии:", payload);
    callback(payload);
  });
}
