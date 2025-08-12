<script setup>
import { listenFCMMessages } from '@/utils/messaging';
import { onMounted } from 'vue';
defineOptions({
  name: 'App'
});

onMounted(() => {
  listenFCMMessages((payload) => {
    const { title, body } = payload.notification;
    alert(`🔔 ${title}: ${body}`);
  });
})
</script>

<template>
  <router-view />
</template>
