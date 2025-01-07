import { ref } from "vue";
import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useUserStore = defineStore("user", () => {
  const userId = ref("");
  const userEmail = ref(""); // Новый реф для хранения email пользователя

  // Инициализация Firebase Auth и отслеживание состояния
  const initializeAuth = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.value = user.uid;
        userEmail.value = user.email; // Сохраняем email
        console.log("Пользователь авторизован:", user.email); // Логируем email
      } else {
        userId.value = "";
        userEmail.value = "";
        console.log("Пользователь не авторизован");
      }
    });
  };

  return {
    userId,
    userEmail,
    initializeAuth, // Экспортируем метод инициализации
  };
});
