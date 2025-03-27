<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useUserStore } from "src/stores/userStore";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseApp from "src/utils/firebase";

const db = getFirestore(firebaseApp);
const userStore = useUserStore();
const searchQuery = ref('')
const searchResults = ref([]);
const friendsList = ref([]);

const loadFriends = async () => {
  friendsList.value = await userStore.getFriends();
};

const checkRequest = async (receiverId) => {
  if (!userStore.userId) return false;


  const requestId = `${userStore.userId}_${receiverId}`;
  console.log("Ищем документ с ID:", requestId);

  const requestRef = doc(db, "friendRequests", requestId);
  const requestSnap = await getDoc(requestRef);

  if (requestSnap.exists()) {
    console.log("Документ найден:", requestSnap.data());
    const requestData = requestSnap.data()
    if (requestData.status === 'pending') {
      console.log('Статус запроса: ' + requestData.status)
      return true
    }
  } else {
    console.log("Документ НЕ найден!");
  }

  return false
};

const updateRequestStatus = async () => {
  for (const user of userStore.searchResults) {
    user.requestPending = await checkRequest(user.id)
  }
}

const loadUsers = async (query) => {
  await userStore.searchUsers(query);
  await updateRequestStatus();
  searchResults.value = userStore.searchResults
}

const sendRequest = async (userId, userName) => {
  await userStore.sendFriendRequest(userId, userName)
  const user = searchResults.value.find(u => u.id === userId)
  if (user) {
    user.requestPending = true
  }
}

const cancelRequest = async (userId) => {
  await userStore.cancelFriendRequest(userId)
  const user = searchResults.value.find(u => u.id === userId)
  if (user) {
    user.requestPending = false
  }
}

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
    <q-input outlined v-model="searchQuery" label="Введите имя друга" />
    <q-btn label="Поиск" color="primary" @click="loadUsers(searchQuery)" class="q-mt-md search-btn" />

    <p v-if="searchResults.length === 0">Пользователи не найдены</p>

    <ul v-else>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.userName }}
        <q-btn v-if="user.requestPending" round color="red" icon="delete" @click="cancelRequest(user.id)" />
        <q-btn v-else round color="green" icon="add" @click="sendRequest(user.id, user.userName)" />
      </li>
    </ul>

    <p v-if="friendsList.length === 0">У вас нет добавленных друзей</p>
    <ul v-else>
      <li v-for="friend in friendsList" :key="friend">
        {{ friend }}
        <q-btn color="primary" icon="handshake" label="Yo Bro" />
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
}

.q-input {
  width: 100%;
  margin-bottom: 12px;
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
