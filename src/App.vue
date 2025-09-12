<script setup>
import { onMounted } from "vue";
import { requestFCMPermission, listenFCMMessages } from "src/utils/messaging";

defineOptions({
  name: "App",
});

onMounted(() => {
  // Запрашиваем разрешение и сохраняем токен
  requestFCMPermission();

  // Подписываемся на уведомления
  listenFCMMessages((payload) => {
    const { title, body } = payload.notification || {};
    if (title && body) {
      alert(`🔔 ${title}: ${body}`);
    }
    console.log("📩 Уведомление в активном приложении:", payload);
  });
});
</script>

<template>
  <router-view />
</template>
