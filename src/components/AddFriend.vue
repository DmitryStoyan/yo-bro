<script setup>
import { ref } from "vue";
import Loader from "./Loader.vue";
import { useUserStore } from "src/stores/userStore";
import NavBar from "./NavBar.vue";

const userStore = useUserStore();

const searchQuery = ref('');
const searchResults = ref([]);
const isSearchPerformed = ref(false);
const isLoading = ref(false);

const loadUsers = async () => {
  if (!searchQuery.value) return;
  isLoading.value = true;
  await userStore.searchUsers(searchQuery.value);
  searchResults.value = userStore.searchResults;
  isSearchPerformed.value = true;
  isLoading.value = false;
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
</script>

<template>
  <div class="container">
    <NavBar />
    <q-form class="search-form" @submit.prevent="loadUsers(searchQuery)">
      <q-input class="search-input" outlined v-model="searchQuery" label="Введите имя друга" />
      <q-btn :disabled="searchQuery.length === 0" type="submit" icon="search" class="search-btn glass-btn" />
    </q-form>

    <p class="result-text" v-if="isSearchPerformed && searchResults.length === 0">Пользователи не найдены.</p>

    <ul v-else>
      <li class="user glass-block" v-for="user in searchResults" :key="user.id">
        {{ user.userName }}
        <q-btn v-if="user.requestPending && !isLoading" color="red" icon="delete" @click="cancelRequest(user.id)" />
        <q-btn v-else-if="!user.requestPending && !isLoading" class="add-friend-btn" icon="person_add"
          @click="sendRequest(user.id, user.userName)" />
        <Loader v-else />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  width: 90%;
  min-height: 100vh;
  position: absolute;
  padding: 80px 0 0 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  color: white;
  background: linear-gradient(90deg, #667eea, #764ba2);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 95%;
}

.search-input {
  width: 90%;
}

.search-btn {
  border-radius: 10px;
  padding: 10px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  width: 95%;
  max-width: 700px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.glass-block {
  padding: 10px;
  border-radius: 15px;
  max-width: 700px;
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 300px;
}

.glass-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
}

.add-friend-btn {
  background: none;
  border: none;
  color: white;
  background: #03cb0ba3;
  border-radius: 7px;
}

.result-text {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
