<script setup>
import { onMounted, ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, setDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/userStore';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore()
const userStore = useUserStore()

const url = 'https://cakeshop.com.ua/images/AcpSe7kFpmzMfgJUwhyXbNbja_gwkleunua5ZVM9jTQ/h:5000/bG9jYWw/6Ly8vY2FrZXNob3AuY29tLnVhL3B1YmxpY19odG1sL3N0b3JhZ2UvYXBwL3B1YmxpYy9pbWcvcHJvZHVjdC81NzEzXzEuanBn'
const userName = ref('')
const isLoading = ref(false)

const addedProfileInfo = async () => {
	isLoading.value = true

	const user = getAuth().currentUser;

	if (!user) {
		console.error('пользователь не авторизован');
		isLoading.value = false
		return
	}

	const userId = user.uid;
	const docRef = doc(db, `users/${userId}/ProfileInfo`, 'main');
	try {
		// Проверяем, существует ли документ
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			await updateDoc(docRef, { userName: userName.value });
		} else {
			await setDoc(docRef, {
				userName: userName.value,
				friends: [],
			});
		}

		console.log('Профиль успешно обновлен');
	} catch (error) {
		console.error('Ошибка при обновлении профиля:', error);
	} finally {
		isLoading.value = false;
	}
}
</script>

<template>
	<q-page>
		<h2>Мой профиль</h2>
		<div>
			<q-img :src="url" class="profile-avatar">
				<template v-slot:loading>
					<q-spinner-gears color="white"></q-spinner-gears>
				</template>
			</q-img>
			<q-input class="q-mb-md" outlined label="Email" v-model="userStore.userEmail" readonly />
			<q-input class="q-mb-md" outlined label="Имя пользователя" v-model="userName" />
			<q-btn label="Сохранить" color="blue" @click="addedProfileInfo" />
		</div>
		<h2> Email: {{ userStore.userEmail }}</h2>
	</q-page>
</template>

<style scoped>
.profile-avatar {
	width: 150px;
	height: 150px;
	border-radius: 50%;
}
</style>
