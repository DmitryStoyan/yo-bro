// src/utils/messaging.js

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
import firebaseApp from "./firebase";

// ⚠️ Вставьте сюда ваш публичный VAPID ключ (из Firebase Console)
const VAPID_KEY =
  "BDYkhdsevukfsrIPM5iT0zPZp0aULZHFm7kzZsfnqtBYkeQoudMAGNDsNPlNj4kHcufJ2R9xlKt-lS1IzIOkxck"; // пример: 'BHYZpBcY9udE_3R1...'

const messaging = getMessaging(firebaseApp);
const db = getFirestore(firebaseApp);

/**
 * Запрашивает разрешение у пользователя и сохраняет FCM токен в Firestore.
 * @param {string} userId - ID текущего пользователя
 */
export async function requestFCMPermission(userId) {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Разрешение на уведомления не предоставлено");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      console.log("FCM токен:", token);

      // Сохраняем токен в Firestore
      const userRef = doc(db, "users", userId, "ProfileInfo", "main");
      await updateDoc(userRef, { fcmToken: token });

      console.log("Токен успешно сохранён в Firestore");
    } else {
      console.warn("Не удалось получить FCM токен");
    }
  } catch (error) {
    console.error("Ошибка при получении разрешения или токена:", error);
  }
}

/**
 * Подписывается на входящие уведомления в foreground режиме
 * @param {Function} callback - Функция, вызываемая при получении уведомления
 */
export function listenFCMMessages(callback) {
  onMessage(messaging, (payload) => {
    console.log("🔔 Получено foreground-уведомление:", payload);
    callback(payload);
  });
}
