<script setup>
const redirect = () => {
  console.log('redirect');


}
</script>

<template>
  <h2>PageHome</h2>
  <button @click="redirect()">Регистрация/Вход</button>
  <p><a href="/auth">Авторизация</a></p>
</template>
