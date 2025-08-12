// public/firebase-messaging-sw.js

// Импортируем совместимую версию Firebase
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
);

// Конфиг вашего Firebase проекта (тот же, что и в firebase.js)
firebase.initializeApp({
  apiKey: "AIzaSyA4GvD95cepNp3WDqpnSmUIx_vspSAma-8",
  authDomain: "yo-bro-1d8af.firebaseapp.com",
  projectId: "yo-bro-1d8af",
  storageBucket: "yo-bro-1d8af.appspot.com",
  messagingSenderId: "783564485342",
  appId: "1:783564485342:web:d8db20218c261876d6884f",
});

// Получаем объект messaging
const messaging = firebase.messaging();

// Обработка входящих сообщений в фоновом режиме
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/icon-192x192.png", // можно заменить на свой путь к иконке
  };

  // Показываем уведомление
  self.registration.showNotification(notificationTitle, notificationOptions);
});
