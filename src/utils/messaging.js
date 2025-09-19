// src/utils/messaging.js
import { Capacitor } from "@capacitor/core";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import {
  getToken as getWebToken,
  onMessage as onWebMessage,
} from "firebase/messaging";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import firebaseApp from "./firebase";

const db = getFirestore(firebaseApp);
const VAPID_KEY =
  "BDYkhdsevukfsrIPM5iT0zPZp0aULZHFm7kzZsfnqtBYkeQoudMAGNDsNPlNj4kHcufJ2R9xlKt-lS1IzIOkxck";

// Инициализация Firebase Messaging только для Web
let webMessaging = null;
if (!Capacitor.isNativePlatform()) {
  webMessaging = getMessaging(firebaseApp);
}

/**
 * Сохраняет FCM-токен в Firestore:
 * users/{uid}/ProfileInfo/main.fcmTokens[]
 */
async function saveFCMToken(userId, token) {
  const userRef = doc(db, "users", userId, "ProfileInfo", "main");
  await updateDoc(userRef, {
    fcmTokens: arrayUnion(token),
  });
  console.log("✅ Токен сохранён в Firestore:", token);
}

/**
 * Удаляет FCM-токен из Firestore.
 */
export async function removeFCMToken(userId, token) {
  const userRef = doc(db, "users", userId, "ProfileInfo", "main");
  await updateDoc(userRef, {
    fcmTokens: arrayRemove(token),
  });
  console.log("🗑️ Удалён недействительный токен:", token);
}

/**
 * Запрашивает разрешение на уведомления и сохраняет FCM-токен.
 * Работает по-разному для Web и Native.
 */
export async function requestFCMPermission(userId, token = null) {
  try {
    // --- Native (Android/iOS) через Capacitor ---
    if (Capacitor.isNativePlatform()) {
      const permStatus = await FirebaseMessaging.requestPermissions();
      if (permStatus.receive !== "granted") {
        console.warn("❌ Разрешение на пуши не предоставлено (native)");
        return false;
      }

      const { token: nativeToken } = await FirebaseMessaging.getToken();
      if (nativeToken) {
        await saveFCMToken(userId, nativeToken);
        return true;
      }
      return false;
    }

    // --- Web через Firebase SDK ---
    if (token) {
      // Если токен передан явно → сохраняем
      await saveFCMToken(userId, token);
      return true;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Разрешение на уведомления не предоставлено (web)");
      return false;
    }

    const webToken = await getWebToken(webMessaging, { vapidKey: VAPID_KEY });
    if (webToken) {
      await saveFCMToken(userId, webToken);
      return true;
    }

    console.warn("⚠️ Не удалось получить FCM-токен (web)");
    return false;
  } catch (error) {
    console.error("🔥 Ошибка при запросе разрешения на пуши:", error);
    return false;
  }
}

/**
 * Подписывается на уведомления.
 */
export function listenFCMMessages(callback) {
  if (Capacitor.isNativePlatform()) {
    FirebaseMessaging.addListener("notificationReceived", (event) => {
      console.log("📩 Push (native):", event);
      if (callback) callback(event);
    });
  } else if (webMessaging) {
    onWebMessage(webMessaging, (payload) => {
      console.log("🔔 Push (web):", payload);
      if (callback) callback(payload);
    });
  } else {
    console.log("ℹ️ Нет доступного Messaging (webMessaging is null)");
  }
}

// import {
//   // getMessaging,
//   getToken,
//   onMessage,
//   deleteToken,
// } from "firebase/messaging";
// import {
//   getFirestore,
//   doc,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import firebaseApp from "./firebase";

// const VAPID_KEY =
//   "BDYkhdsevukfsrIPM5iT0zPZp0aULZHFm7kzZsfnqtBYkeQoudMAGNDsNPlNj4kHcufJ2R9xlKt-lS1IzIOkxck";

// // const messaging = getMessaging(firebaseApp);
// const db = getFirestore(firebaseApp);

// /**
//  * Сохраняет FCM-токен в Realtime Database.
//  * Токен сохраняется по пути: users/{uid}/fcmTokens/{token} = true
//  */
// async function saveFCMToken(userId, token) {
//   const userRef = doc(db, "users", userId, "ProfileInfo", "main");
//   await updateDoc(userRef, {
//     fcmTokens: arrayUnion(token),
//   });
//   console.log("✅ Токен сохранён в Firestore:", token);
// }

// /**
//  * Удаляет FCM-токен из Realtime Database.
//  */
// export async function removeFCMToken(userId, token) {
//   const userRef = doc(db, "users", userId, "ProfileInfo", "main");
//   await updateDoc(userRef, {
//     fcmTokens: arrayRemove(token),
//   });
//   console.log("🗑️ Удалён недействительный токен:", token);
// }

// /**
//  * Запрашивает разрешение на уведомления и регистрирует FCM-токен.
//  * @param {string} userId - ID пользователя
//  * @param {string} [token] - FCM-токен (опционально, если передан из Capacitor)
//  */
// export async function requestFCMPermission(userId, token = null) {
//   try {
//     if (token) {
//       // Если токен передан (например, из Capacitor), сохраняем его
//       await saveFCMToken(userId, token);
//       return true;
//     }

//     // Веб-логика для получения токена
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.warn("❌ Разрешение на уведомления не предоставлено");
//       if (/Android/i.test(navigator.userAgent)) {
//         alert(
//           "Уведомления отключены. Пожалуйста, включите их в настройках устройства: Настройки > Приложения > Yo Bro > Уведомления."
//         );
//       }
//       return false;
//     }

//     const newToken = await getToken(messaging, { vapidKey: VAPID_KEY });
//     if (newToken) {
//       console.log("FCM-токен:", newToken);
//       await saveFCMToken(userId, newToken);
//       return true;
//     } else {
//       console.warn("⚠️ Не удалось получить FCM-токен");
//       return false;
//     }

//     // Сохраняем токен
//     await saveFCMToken(uid, token);
//     return true;
//   } catch (error) {
//     console.error("Ошибка при запросе разрешения на пуши:", error);
//     return false;
//   }
// }

// /**
//  * Подписывается на получение уведомлений в активном состоянии.
//  */
// export function listenFCMMessages(callback) {
//   onMessage(messaging, (payload) => {
//     console.log("🔔 Получено уведомление в активном состоянии:", payload);
//     callback(payload);
//   });
// }

// import { Capacitor } from "@capacitor/core";
// import { FirebaseMessaging } from "@capacitor-firebase/messaging";
// import { getAuth } from "firebase/auth";
// import { getDatabase, ref, set } from "firebase/database";

// export async function requestFCMPermission() {
//   if (!Capacitor.isNativePlatform()) {
//     console.log("🌐 Web-режим: пуши отключены");
//     return;
//   }

//   try {
//     const permStatus = await FirebaseMessaging.requestPermissions();
//     if (permStatus.receive === "granted") {
//       const tokenResult = await FirebaseMessaging.getToken();
//       const fcmToken = tokenResult.token;

//       console.log("📲 FCM Token:", fcmToken);

//       const user = getAuth().currentUser;
//       if (user && fcmToken) {
//         const db = getDatabase();
//         await set(ref(db, `users/${user.uid}/fcmTokens/${fcmToken}`), true);
//       }
//     }
//   } catch (err) {
//     console.error("🔥 Ошибка при получении токена:", err);
//   }
// }

// export function listenFCMMessages(callback) {
//   if (!Capacitor.isNativePlatform()) {
//     console.log("🌐 Web-режим: слушатель пушей отключен");
//     return;
//   }

//   FirebaseMessaging.addListener("notificationReceived", (event) => {
//     console.log("📩 Уведомление:", event);
//     if (callback) callback(event);
//   });
// }
