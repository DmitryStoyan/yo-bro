<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useUserStore } from "src/stores/userStore";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseApp from "src/utils/firebase";
import Loader from "./Loader.vue";
import { sendYoBro } from "src/utils/sendYoBro";

const db = getFirestore(firebaseApp);
const userStore = useUserStore();
const searchQuery = ref('');
const searchResults = ref([]);
const friendsList = ref([]);
const isSearchPerformed = ref(false);
const isLoadingFriends = ref(false);
const isLoadingSearch = ref(false);
const isLoading = ref(false);

const loadFriends = async () => {
  isLoadingFriends.value = true;
  friendsList.value = await userStore.getFriends();
  isLoadingFriends.value = false;
};

const checkRequest = async (receiverId) => {
  if (!userStore.userId) return false;
  const requestId = `${userStore.userId}_${receiverId}`;
  const requestRef = doc(db, "friendRequests", requestId);
  const requestSnap = await getDoc(requestRef);

  if (requestSnap.exists()) {
    const requestData = requestSnap.data();
    return requestData.status === 'pending';
  }
  return false;
};

const updateRequestStatus = async () => {
  for (const user of userStore.searchResults) {
    user.requestPending = await checkRequest(user.id);
  }
};

const loadUsers = async (query) => {
  isLoadingSearch.value = true;
  await userStore.searchUsers(query);
  await updateRequestStatus();
  searchResults.value = userStore.searchResults;
  isLoadingSearch.value = false;
  isSearchPerformed.value = true;
};

const sendRequest = async (userId, userName) => {
  isLoading.value = true;
  await userStore.sendFriendRequest(userId, userName);
  const user = searchResults.value.find(u => u.id === userId);
  if (user) user.requestPending = true;
  isLoading.value = false;
};

const cancelRequest = async (userId) => {
  isLoading.value = true;
  await userStore.cancelFriendRequest(userId);
  const user = searchResults.value.find(u => u.id === userId);
  if (user) user.requestPending = false;
  isLoading.value = false;
};

const sendYoBroToFriend = async (friendId) => {
  console.log("Sending Yo Bro to friendId:", friendId);
  try {
    isLoading.value = true;
    await sendYoBro(friendId);
    alert('Yo Bro отправлен!');
  } catch (error) {
    console.error('Ошибка при отправке Yo Bro:', error);
    alert('Не удалось отправить Yo Bro');
  } finally {
    isLoading.value = false;
  }
};


watchEffect(() => {
  searchResults.value = userStore.searchResults;
});

onMounted(() => {
  loadFriends();
});
</script>

<template>
  <div class="container">
    <h2 class="title">Друзья</h2>

    <q-form @submit.prevent="loadUsers(searchQuery)">
      <q-input outlined v-model="searchQuery" label="Введите имя друга" />
      <q-btn :disabled="searchQuery.length === 0" type="submit" label="Поиск" color="primary"
        class="q-mt-md search-btn" />
    </q-form>

    <p v-if="isSearchPerformed && searchResults.length === 0">Пользователи не найдены</p>

    <ul v-else>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.userName }}
        <q-btn v-if="user.requestPending && !isLoading" round color="red" icon="delete"
          @click="cancelRequest(user.id)" />
        <q-btn v-else-if="!user.requestPending && !isLoading" round color="green" icon="add"
          @click="sendRequest(user.id, user.userName)" />
        <Loader v-else />
      </li>
    </ul>

    <Loader v-if="isLoadingFriends" />
    <p v-if="friendsList.length === 0">У вас нет добавленных друзей</p>
    <ul v-else>
      <li v-for="friend in friendsList" :key="friend.id">
        {{ friend.name }}
        <q-btn :loading="isLoading" color="primary" icon="handshake" label="Yo Bro"
          @click="sendYoBroToFriend(friend.id)" />
      </li>
    </ul>

  </div>
</template>

<style scoped>
.container {
  width: 95%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
}

.title {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin: 0 0 30px 0;
}

.q-input {
  width: 100%;
  margin: 0 0 12px 0;
}

.q-btn {
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

.q-btn:hover {
  transform: scale(1.05);
}

ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: background 0.3s;
}

li:hover {
  background: #e0e0e0;
}

.search-btn {
  margin: 0 0 30px 0;
}

.q-btn[icon="add"] {
  background: #4caf50;
  color: white;
}

.q-btn[icon="delete"] {
  background: #f44336;
  color: white;
}
</style>
