<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from 'src/stores/userStore';
import { computed } from 'vue';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const currentView = computed(() => route.name)

const navigateTo = (path) => {
  router.push(path)
}

const goBack = () => {
  router.back()
}

const logOut = async () => {
  await userStore.logOut()
  router.push('/')
}
</script>

<template>
  <q-header class="navbar">
    <template v-if="currentView == 'Profile'">
      <div class="nav-left">
        <q-btn class="navbar__btn navbar__arrow_back-btn glass-btn" icon="arrow_back"
          @click="navigateTo('FriendsList')"></q-btn>
        <h2 class="title">Профиль</h2>
      </div>
      <q-btn class="navbar__btn glass-btn" icon="logout" @click="logOut"></q-btn>
    </template>

    <template v-else-if="currentView == 'FriendsList'">
      <div class="nav-left">
        <q-btn class="navbar__btn glass-btn" icon="person" @click="navigateTo('Profile')"></q-btn>
        <h2 class="title">Йоу, бро!</h2>
      </div>
      <div class="nav-right">
        <q-btn class="navbar__btn navbar__notification-btn glass-btn" icon="notifications"
          @click="navigateTo('Notification')"></q-btn>
        <q-btn class="navbar__btn glass-btn" icon="search"></q-btn>
        <q-btn class="navbar__btn glass-btn" icon="logout" @click="logOut"></q-btn>
      </div>
    </template>

    <template v-if="currentView == 'Notification'">
      <div class="nav-left">
        <q-btn class="navbar__btn navbar__arrow_back-btn glass-btn" icon="arrow_back"
          @click="navigateTo('FriendsList')"></q-btn>
        <h2 class="title">Уведомления</h2>
      </div>
    </template>

    <template v-if="currentView == 'AddFriend'">
      <div class="nav-left">
        <q-btn class="navbar__btn navbar__arrow_back-btn glass-btn" icon="arrow_back"
          @click="navigateTo('FriendsList')"></q-btn>
        <h2 class="title">Добавить друга</h2>
      </div>
    </template>


  </q-header>
</template>

<style scoped>
.navbar {
  width: 100%;
  max-width: 1365px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0 20px;
  margin: 0 auto;
  background: transparent;
  z-index: 10;
  background: linear-gradient(90deg, #667eea, #764ba2);
  /* background: linear-gradient(90deg, #8c28fa, #009ce8); */
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title {
  color: white;
  font-size: 20px;
  font-weight: normal;
}

.navbar__btn {
  width: 35px;
  height: 35px;
  border-radius: 10px;
}

.navbar__arrow_back-btn {
  margin: 0 15px 0 0;
}

.q-btn,
.q-btn:before,
.q-btn:after,
.q-btn__content {
  box-shadow: none !important;
}


.q-btn .q-icon,
.q-btn {
  font-size: 10px;
}

.glass-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
}

.q-btn:hover {
  /* background-color: #1976d2; */
  transform: scale(1.05);
}

.q-btn:active {
  transform: scale(0.98);
}
</style>
