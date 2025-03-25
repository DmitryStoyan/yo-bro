<template>
  <q-page class="page">

    <q-img class="bg-img" src="../assets/background/homeBG.gif" />

    <h1>Главная страница</h1>
    <p>Это приложение..... Тут будет описание</p>
    <q-btn label="Регистрация/Вход" @click="goToAuth" v-if="!userStore.userId" />
    <q-btn label="Выход" @click="logOut" v-else />
    <q-btn label="Профиль" @click="goToProfile" />
    <q-btn label="Друзья" @click="goToFriendsList" />
    <q-btn label="Уведомления" @click="goToNotification" />
    <checkAuth />
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/userStore';
import checkAuth from 'src/components/checkAuth.vue';

const userStore = useUserStore();

const router = useRouter()
const goToAuth = () => {
  router.push('/auth')
}
const goToProfile = () => {
  router.push('/profile')
}

const goToFriendsList = () => {
  router.push('/friendsList')
}

const goToNotification = () => {
  router.push('/notification')
}



const logOut = async () => {
  await userStore.logOut()
  router.push('/auth')
}
</script>

<style scoped>
.page {
  position: relative;
  height: 100vh;
}

.bg-img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  z-index: -1;
}
</style>
