<template>
  <q-page>
    <h1>Главная страница</h1>
    <p>Это приложение.....</p>
    <q-btn label="Регистрация/Вход" @click="goToAuth" />
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const goToAuth = () => {
  console.log('redirect');
  router.push('/auth')
}
</script>
