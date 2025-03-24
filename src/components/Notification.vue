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

</script>

<template>
  <div>
    <h2>Уведомления</h2>
    <!-- <q-btn color="primary" icon="check" label="OK" @click="userStore.getFriendRequests" /> -->
    <ul>
      <li v-for="request in userStore.incomingRequests" :key="request.id">
        {{ request.fromUserName }}
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
