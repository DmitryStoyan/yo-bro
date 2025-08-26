import {
  getMessaging,
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

const messaging = getMessaging(firebaseApp);
const db = getFirestore(firebaseApp);

/**
 * Сохраняет FCM токен в Firestore (в массив fcmTokens).
 */
async function saveFCMToken(userId, token) {
  const userRef = doc(db, "users", userId, "ProfileInfo", "main");
  await updateDoc(userRef, {
    fcmTokens: arrayUnion(token),
  });
  console.log("✅ Токен сохранён в Firestore:", token);
}

/**
 * Удаляет FCM токен из Firestore (если сервер сказал, что он устарел).
 */
export async function removeFCMToken(userId, token) {
  const userRef = doc(db, "users", userId, "ProfileInfo", "main");
  await updateDoc(userRef, {
    fcmTokens: arrayRemove(token),
  });
  console.log("🗑️ Удалён невалидный токен:", token);
}

/**
 * Запрашивает разрешение у пользователя и регистрирует актуальный FCM токен.
 */
export async function requestFCMPermission(userId) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Разрешение на уведомления не предоставлено");
      return;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      console.log("FCM токен:", token);
      await saveFCMToken(userId, token);
    } else {
      console.warn("⚠️ Не удалось получить FCM токен");
    }
  } catch (error) {
    console.error("Ошибка при получении токена:", error);
  }
}

/**
 * Подписывается на входящие уведомления в foreground
 */
export function listenFCMMessages(callback) {
  onMessage(messaging, (payload) => {
    console.log("🔔 Получено foreground-уведомление:", payload);
    callback(payload);
  });
}
