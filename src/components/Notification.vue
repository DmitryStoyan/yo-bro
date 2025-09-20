<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useUserStore } from 'src/stores/userStore';
import { getFirestore, doc, getDoc, query, where, collection } from 'firebase/firestore';
import firebaseApp from "src/utils/firebase";
import Loader from './Loader.vue';
import NavBar from './NavBar.vue';


const userStore = useUserStore();
const db = getFirestore(firebaseApp);
const isLoadingNotificationList = ref(true)
const isLoading = ref(false)

const deleteRequest = async (requestId) => {
  isLoading.value = true
  await userStore.declineFriendRequest(requestId)
  console.log(requestId)
  isLoading.value = false
}

const acceptFriendRequest = async (requestId) => {
  isLoading.value = true
  await userStore.acceptFriendRequest(requestId);
  isLoading.value = false
}

onMounted(() => {
  userStore.getFriendRequests()
  isLoadingNotificationList.value = false
})

watchEffect(() => {
  if (userStore.userId) {
    isLoadingNotificationList.value = true
    userStore.getFriendRequests();
    isLoadingNotificationList.value = false
  }
});

</script>

<template>
  <div class="notifications-container">
    <NavBar />
    <!-- <h2 class="title">Уведомления</h2> -->
    <p v-if="userStore.incomingRequests.length == 0" class="no-notifications">Нет уведомлений</p>
    <ul v-else class="notifications-list">
      <li v-for="request in userStore.incomingRequests" :key="request.id" class="notification-item">
        <span class="request-from">{{ request.fromUserName }}</span>
        <div class="actions" v-if="!isLoading">
          <q-btn round color="green" icon="add" @click="acceptFriendRequest(request.id)"
            class="action-btn accept-btn" />
          <q-btn round color="red" icon="cancel" @click="deleteRequest(request.id)" class="action-btn decline-btn" />
        </div>
        <Loader v-else />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.notifications-container {
  width: 95%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  min-height: 100vh;
  color: white;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: normal;
}

.no-notifications {
  text-align: center;
  font-style: italic;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.notifications-list {
  list-style: none;
  padding: 0;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin: 8px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.notification-item:hover {
  transform: translateY(-5px);
}

.request-from {
  font-weight: bold;
  color: #333;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  transition: background-color 0.3s, transform 0.2s;
}

.accept-btn {
  background-color: #4CAF50;
}

.decline-btn {
  background-color: #F44336;
}

.accept-btn:hover {
  background-color: #45a049;
  transform: scale(1.1);
}

.decline-btn:hover {
  background-color: #e53935;
  transform: scale(1.1);
}

.action-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.5);
}

.decline-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.5);
}
</style>
