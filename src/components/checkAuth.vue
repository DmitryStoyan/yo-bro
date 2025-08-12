<script setup>
import { useUserStore } from 'src/stores/userStore';
const userStore = useUserStore()
</script>

<template>
  <div>
    <p v-if="userStore.userEmail" class="auth">Пользователь авторизован. Email {{ userStore.userEmail }}.</p>
    <p v-else class="not-auth">Пользователь не авторизован</p>
  </div>
</template>

<style scoped>
.auth {
  color: green;
}

.not-auth {
  color: red;
}
</style>
