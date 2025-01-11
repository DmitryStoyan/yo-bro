<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from 'src/stores/userStore';
const userStore = useUserStore()

const isAuthenticated = ref(false);
const userEmail = ref('');

// onMounted(() => {
//   if (userStore.userEmail) {
//     isAuthenticated.value = true;
//     userEmail.value = userStore.userEmail
//   } else {
//     isAuthenticated.value = false;
//   }
// })

watch(() => userStore.userEmail, (newEmail) => {
  if (newEmail) {
    isAuthenticated.value = true;
    userEmail.value = newEmail;
  } else {
    isAuthenticated.value = false;
    userEmail.value = '';
  }
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
