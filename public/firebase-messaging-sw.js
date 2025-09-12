// importScripts(
//   "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyA4GvD95cepNp3WDqpnSmUIx_vspSAma-8",
//   authDomain: "yo-bro-1d8af.firebaseapp.com",
//   projectId: "yo-bro-1d8af",
//   storageBucket: "yo-bro-1d8af.appspot.com",
//   messagingSenderId: "783564485342",
//   appId: "1:783564485342:web:d8db20218c261876d6884f",
// });

// const messaging = firebase.messaging();

// // Обрабатываем фоновые сообщения
// messaging.onBackgroundMessage(function (payload) {
//   console.log(
//     "[firebase-messaging-sw.js] Получено фоновое сообщение:",
//     payload
//   );

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "/icons/icon-192x192.png",
//     // Указываем канал для Android
//     channelId: "yo-bro-notifications",
//   };

//   // Показываем уведомление
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
