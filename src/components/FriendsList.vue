<script setup>
import { computed } from "vue";
import { useUserStore } from "src/stores/userStore";

const userStore = useUserStore();

const loadAllUsers = async () => {
  await userStore.getAllUsers()
}
</script>

<template>
  <div>
    <h2>Список всех пользователей</h2>

    <q-btn label="Вывести всех пользователей" color="primary" @click="loadAllUsers" class="q-mt-md" />

  </div>
</template>
