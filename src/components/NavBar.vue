<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/userStore';
import { computed } from 'vue';

const userStore = useUserStore();
const router = useRouter();

const isAuthenticated = computed(() => !!userStore.userId)

const navigationLinks = [
  { label: 'Профиль', path: '/profile' },
  { label: 'Друзья', path: '/friendsList' },
  { label: 'Уведомления', path: '/notification' },
]

const navigateTo = (path) => {
  router.push(path)
}

const logOut = async () => {
  await userStore.logOut()
  router.push('/')
}
</script>

<template>
  <q-header class="navbar">
    <div class="navbar-container">
      <img class="logo" src="@/assets/logo/logo.jpg" alt="Yo" @click="navigateTo('/')">

      <div v-if="isAuthenticated" class="nav-links">
        <q-btn v-for="link in navigationLinks" :key="link.path" :label="link.label" @click="navigateTo(link.path)"
          class="nav-button" />
      </div>
      <q-btn v-if="isAuthenticated" label="Выход" @click="logOut" class="logout-button" />
      <q-btn v-else label="Вход\Регистриция" class="logout-button" @click="navigateTo('/auth')" />
    </div>
  </q-header>
</template>

<style scoped>
.navbar {
  background: black;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-button,
.logout-button {
  color: white;
  border: 1px solid white;
}
</style>
