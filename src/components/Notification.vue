<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useUserStore } from 'src/stores/userStore';
import { getFirestore, doc, getDoc, query, where, collection } from 'firebase/firestore';
import firebaseApp from "src/utils/firebase";


const userStore = useUserStore();
const db = getFirestore(firebaseApp);

onMounted(() => {
  userStore.getFriendRequests()
})

watchEffect(() => {
  if (userStore.userId) {
    userStore.getFriendRequests();
  }
});

</script>

<template>
  <div>
    <h2>Уведомления</h2>
    <p v-if="userStore.incomingRequests.length == 0">Нет уведомлений</p>
    <ul v-else>
      <li v-for="request in userStore.incomingRequests" :key="request.id">
        {{ request.fromUserName }}
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
