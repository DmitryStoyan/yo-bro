import { onMounted } from "vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";

import { useUserStore } from "@/stores/userStore";
import { requestFCMPermission, listenFCMMessages } from "@/utils/messaging";

const app = createApp(App);

app.use(Quasar, quasarUserOptions);
app.use(router);

app.mount("#app");

// 🚀 Запускаем пуши при входе пользователя
onMounted(async () => {
  const userStore = useUserStore();

  if (userStore.userId) {
    console.log("🔑 Пользователь найден:", userStore.userId);

    // Запрашиваем разрешение и сохраняем FCM-токен
    await requestFCMPermission(userStore.userId);

    // Подписываемся на входящие уведомления
    listenFCMMessages((notification) => {
      const { title, body } = notification;
      alert(`🔔 ${title}: ${body}`);
    });
  } else {
    console.warn("⚠️ Пользователь не авторизован, пуши не активированы");
  }
});
