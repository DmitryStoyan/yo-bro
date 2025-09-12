import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, remove } from "firebase/database";

/**
 * Сохраняет FCM-токен в Realtime Database.
 * Токен сохраняется по пути: users/{uid}/fcmTokens/{token} = true
 */
async function saveFCMToken(userId, token) {
  const db = getDatabase();
  await set(ref(db, `users/${userId}/fcmTokens/${token}`), true);
  console.log("✅ Токен сохранён в Realtime DB:", token);
}

/**
 * Удаляет FCM-токен из Realtime Database.
 */
export async function removeFCMToken(userId, token) {
  const db = getDatabase();
  await remove(ref(db, `users/${userId}/fcmTokens/${token}`));
  console.log("🗑️ Удалён недействительный токен:", token);
}

/**
 * Запрашивает разрешение и сохраняет FCM-токен в базе.
 * @param {string} [userId] - UID пользователя. Если не передан, берётся из getAuth().
 */
export async function requestFCMPermission(userId = null) {
  try {
    const permStatus = await FirebaseMessaging.requestPermissions();
    if (permStatus.receive !== "granted") {
      console.warn("❌ Разрешение на уведомления не предоставлено");
      return false;
    }

    // Получаем FCM-токен
    const { token } = await FirebaseMessaging.getToken();
    console.log("📲 FCM-токен:", token);

    // Определяем UID пользователя
    const user = getAuth().currentUser;
    const uid = userId || (user ? user.uid : null);

    if (!uid) {
      console.warn("⚠️ Нет авторизованного пользователя — токен не сохранён");
      return false;
    }

    // Сохраняем токен
    await saveFCMToken(uid, token);
    return true;
  } catch (error) {
    console.error("Ошибка при получении токена:", error);
    return false;
  }
}

/**
 * Подписывается на получение уведомлений в активном состоянии.
 */
export function listenFCMMessages(callback) {
  FirebaseMessaging.addListener("notificationReceived", (payload) => {
    console.log("🔔 Получено уведомление:", payload);
    if (callback) callback(payload);
  });
}
