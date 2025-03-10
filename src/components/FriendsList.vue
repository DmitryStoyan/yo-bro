<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useUserStore } from "src/stores/userStore";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseApp from "src/utils/firebase";

const db = getFirestore(firebaseApp);
const userStore = useUserStore();

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
      console.log('Статус запроса - pending')
      return true
    }
  } else {
    console.log("Документ НЕ найден!");
  }

  return false
};


watchEffect(() => {
  if (userStore.userId) {
    checkRequest("Dyn8ztPLyVO06PChaQRwKXPowmX2");
  }
});

</script>

<template>
  <div>
    <h2>Список всех пользователей</h2>
    <q-input outlined v-model="searchQuery" label="Поиск пользователей" />
    <q-btn label="Поиск" color="primary" class="q-mt-md" />
    <q-btn label="Вывести всех пользователей" color="primary" @click="loadAllUser" class="q-mt-md" />
  </div>
</template>
