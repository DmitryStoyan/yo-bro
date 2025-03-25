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

const loadAllUser = async () => {
  await userStore.getAllUsers();
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
  <div>
    <h2>Список всех пользователей</h2>
    <q-input outlined v-model="searchQuery" label="Поиск пользователей" />
    <q-btn label="Поиск" color="primary" @click="loadUsers(searchQuery)" class="q-mt-md" />
    <q-btn label="Вывести всех пользователей" color="primary" @click="loadAllUser" class="q-mt-md" />

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
      </li>
    </ul>
  </div>
</template>
