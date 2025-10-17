<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { useUserStore } from '@/stores/userStore';
import { v4 as uuidv4 } from 'uuid';
import Loader from 'src/components/Loader.vue';
import { is } from 'quasar';
import NavBar from 'src/components/NavBar.vue';

const db = getFirestore()
const userStore = useUserStore()

const isLoading = ref(false)
const isEditing = ref(false)

const localUserName = ref('');

const startEditing = () => {
  localUserName.value = userStore.userName;
  isEditing.value = true;
}

const cancelEditing = () => {
  localUserName.value = userStore.userName;
  isEditing.value = false;

}

const updateProfile = async () => {
  isLoading.value = true;
  await userStore.updateUserProfile(localUserName.value)
  isLoading.value = false;
  isEditing.value = false
  console.log('Имя пользователя изменено на: ', userStore.userName)
}

const formatDate = (date) => {
  if (!date) return 'Неизвестно';

  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

onMounted(() => {
  userStore.loadFriends();
})

</script>

<template>
  <q-page class="page">

    <div class="content">
      <div class="content__avatar">
        <q-img src="../assets/images/avatar.png" class="profile-avatar">
          <template v-slot:loading>
            <q-spinner-gears color="white"></q-spinner-gears>
          </template>
        </q-img>
        <q-btn class="content__avatar-btn glass-btn" round icon="photo_camera"></q-btn>
      </div>
      <div class="content__form glass-block">
        <div class="flex justify-between items-center q-mb-lg">
          <h3 class="content__title">Информация профиля</h3>

          <div v-if="!isEditing">
            <q-btn class="glass-btn" label="Edit" icon="edit" @click="startEditing"></q-btn>
          </div>

          <div class="buttons-wrapper flex" v-else>
            <q-btn class="content__save-btn glass-btn" label="" icon="save" @click="updateProfile"></q-btn>
            <Loader class="loader" v-if="isLoading" />
            <q-btn class="content__cancel-btn glass-btn" v-else label="" icon="close" @click="cancelEditing"></q-btn>
          </div>
        </div>

        <div v-if="!isEditing">
          <div>
            <label class='content__form-label' for="">Email</label>
            <p class="content__form-value">{{ userStore.userEmail }}</p>
          </div>
          <div>
            <label class='content__form-label' for="">Имя пользователя</label>
            <p class="content__form-value">{{ userStore.userName }}</p>
          </div>
          <div>
            <label class='content__form-label' for="">Bro c </label>
            <p class="content__form-value">{{ formatDate(userStore.registrationDate) }}</p>
          </div>
        </div>

        <div v-else class="content__form">
          <label class='content__form-label' for="">Email</label>
          <q-input class="content__form-input q-mb-md" borderless v-model="userStore.userEmail" readonly />
          <label class='content__form-label' for="">Имя пользователя</label>
          <q-input class="content__form-input q-mb-md" borderless v-model="localUserName" />
        </div>
      </div>

      <div class="statistics glass-block">
        <h3 class="content__title q-mb-lg">Статистика</h3>

        <div class="statistics-content">
          <div class="statistic-item">
            <p class="statistic-value">{{ userStore.friends.length }}</p>
            <p class="statistic-label">Братаны</p>
          </div>
          <div class="statistic-item">
            <p class="statistic-value">156</p>
            <p class="statistic-label">Отправлено Yo</p>
          </div>
          <div class="statistic-item">
            <p class="statistic-value">23</p>
            <p class="statistic-label">Дней с первого Yo</p>
          </div>
        </div>
      </div>

      <div class="achievements glass-block">
        <h3 class="content__title q-mb-lg">Достижения</h3>

        <div class="achievements-content">
          <div class="achievements-item achievement_received">
            <q-img class="achievements-img" src="../assets/achievements/firstYo.png"></q-img>
            <div class="achievements-item-text">
              <p class="achievements-name">First Yo</p>
              <p class="achievements-description">Отправить свой первый Йоу</p>
            </div>
          </div>
          <div class="achievements-item achievement_received">
            <q-img class="achievements-img" src="../assets/achievements/connector.png"></q-img>
            <div class="achievements-item-text">
              <p class="achievements-name">Connector</p>
              <p class="achievements-description">Добавить 10 братанов</p>
            </div>
          </div>
          <div class="achievements-item">
            <q-img class="achievements-img" src="../assets/achievements/yoMaster.png"></q-img>
            <div class="achievements-item-text">
              <p class="achievements-name">Yo Master</p>
              <p class="achievements-description">Отправить 500 Йоу</p>
            </div>
          </div>
          <div class="achievements-item">
            <q-img class="achievements-img" src="../assets/achievements/popular.png"></q-img>
            <div class="achievements-item-text">
              <p class="achievements-name">Popular</p>
              <p class="achievements-description">Добавить 50 братанов</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<style scoped>
.page {
  padding: 61px 0 0 0 !important;
  min-height: 100vh;
  /* background: linear-gradient(122deg, #8c28fa, #009ce8); */
  background: transparent;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.content {
  max-width: 1920px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0 0 0;

}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.q-input {
  width: 100%;
}

.content__form-input {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 0px 10px;
}

.content__cancel-btn {
  background: rgba(251, 0, 0, 0.5) !important;
}

.content__save-btn {
  background: rgba(66, 165, 0, 0.5) !important;
}


.content__form-label {
  font-size: 14px;
  opacity: 0.8;
  color: white;
  margin-bottom: 5px;
  display: block;
}

.content__form-value {
  font-size: 16px;
  font-weight: normal;
}

.buttons-wrapper {
  gap: 10px;
}

.statistics-content {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  margin: 15px 0 0 0;
}

.statistic-label {
  width: 90%;
  opacity: 0.8;
}

.statistic-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.statistic-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.q-btn {
  max-width: 200px;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.q-btn,
.q-btn:before,
.q-btn:after,
.q-btn__content {
  box-shadow: none !important;
}


.q-btn .q-icon,
.q-btn {
  font-size: 10px;
}

.glass-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
}

.glass-block {
  padding: 20px;
  margin: 0 0 30px 0;
  border-radius: 15px;
  max-width: 500px;
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 300px;
}

.content__avatar {
  position: relative;
  margin-bottom: 35px;
}

.content__avatar-btn {
  background: rgba(255, 255, 255, 0.2);
  position: absolute;
  top: 80%;
  right: 0;
}

.content__title {
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
  max-width: 100%;
  max-width: 140px;
}

.achievements-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.achievements-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
  border-radius: 15px;
  padding: 10px;
  min-height: 77px;
  opacity: 0.6;
}

.achievements-img {
  width: clamp(30px, 20%, 35px);
  height: clamp(30px, 20%, 35px);
  margin-right: 15px;
}

.achievements-name {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}

.achievements-description {
  font-size: 12px;
  opacity: 0.8;
  margin: 0;
}

.achievement_received {
  opacity: 1;
}

.q-btn:hover {
  /* background-color: #1976d2; */
  transform: scale(1.05);
}

.q-btn:active {
  transform: scale(0.98);
}
</style>
