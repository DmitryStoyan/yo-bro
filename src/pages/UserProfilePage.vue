<script setup>
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { useUserStore } from '@/stores/userStore';
import { v4 as uuidv4 } from 'uuid';
import Loader from 'src/components/Loader.vue';

const db = getFirestore()
const userStore = useUserStore()

const url = 'https://cakeshop.com.ua/images/AcpSe7kFpmzMfgJUwhyXbNbja_gwkleunua5ZVM9jTQ/h:5000/bG9jYWw/6Ly8vY2FrZXNob3AuY29tLnVhL3B1YmxpY19odG1sL3N0b3JhZ2UvYXBwL3B1YmxpYy9pbWcvcHJvZHVjdC81NzEzXzEuanBn'
const isLoading = ref(false)

const updateProfile = async () => {
  isLoading.value = true;
  await userStore.updateUserProfile(userStore.userName)
  isLoading.value = false;
  console.log('Имя пользователя изменено на: ', userStore.userName)
}

</script>

<template>
  <q-page>
    <h2 class="title">Мой профиль</h2>
    <div class="content">
      <q-img :src="url" class="profile-avatar">
        <template v-slot:loading>
          <q-spinner-gears color="white"></q-spinner-gears>
        </template>
      </q-img>
      <q-input class="q-mb-md" outlined label="Email" v-model="userStore.userEmail" readonly />
      <q-input class="q-mb-md" outlined label="Имя пользователя" v-model="userStore.userName" />
      <Loader class="loader" v-if="isLoading" />
      <q-btn v-else label="Сохранить" color="blue" @click="updateProfile" />
    </div>
  </q-page>
</template>

<style scoped>
.q-page {
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; */
  min-height: 100vh;
  background: #ffffff;
  padding: 20px;
}

.content {
  max-width: 1920px;
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  text-align: center;
  color: #333;
  font-size: 24px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 35px;
}

.q-input {
  width: 100%;
}

.q-btn {
  width: 100%;
  max-width: 200px;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.q-btn:hover {
  background-color: #1976d2;
  transform: scale(1.05);
}

.q-btn:active {
  transform: scale(0.98);
}
</style>
