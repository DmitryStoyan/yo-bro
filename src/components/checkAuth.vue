<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const isAuthenticated = ref(false); // Флаг авторизации
const userEmail = ref('');

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAuthenticated.value = true;
      userEmail.value = user.email;
    } else {
      isAuthenticated.value = false;
      userEmail.value = '';
    }
  });
});
</script>

<template>
  <div>
    <p v-if="isAuthenticated" class="auth">Пользователь авторизован. Email {{ userEmail }}.</p>
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
