<template>
  <q-page>
    <h1>Главная страница</h1>
    <p>Это приложение..... Тут будет описание</p>
    <q-btn label="Регистрация/Вход" @click="goToAuth" v-if="!userStore.userId" />
    <q-btn label="Выход" @click="logOut" v-else />
    <q-btn label="Профиль" @click="goToProfile" />
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

const logOut = async () => {
  await userStore.lotOut()
  router.push('/auth')
}
</script>
