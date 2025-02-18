<script setup>
import { ref, watchEffect } from "vue";
import { useUserStore } from "src/stores/userStore";

const userStore = useUserStore();

const searchQuery = ref('');
const searchResults = ref([]);

const loadAllUsers = async () => {
  await userStore.getAllUsers()
}

const loadUsers = async (query) => {
  await userStore.searchUsers(query)
  console.log(query.value)
}

const sendRequest = async (userId, userName) => {
  await userStore.sendFriendRequest(userId, userName)
}

watchEffect(() => {
  searchResults.value = userStore.searchResults
})
</script>

<template>
  <div>
    <h2>Список всех пользователей</h2>
    <q-input outlined v-model="searchQuery" label="Поиск пользователей" />
    <q-btn label="Поиск" color="primary" @click="loadUsers(searchQuery)" class="q-mt-md" />

    <p v-if="searchResults.length === 0">Пользователи не найдены</p>

    <ul v-else>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.userName }}
        <q-btn round color="green" icon="add" @click="sendRequest(user.id, user.userName)" />
      </li>
    </ul>


    <q-btn label="Вывести всех пользователей" color="primary" @click="loadAllUsers" class="q-mt-md" />

  </div>
</template>
