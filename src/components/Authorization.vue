<script setup>
import app from '../utils/firebase'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Loader from './Loader.vue';
import { getFirestore, doc, setDoc } from "firebase/firestore";


const router = useRouter()
const auth = getAuth(app);

const tab = ref('authorization')
const isLoading = ref(false)
const errorMesaage = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: '',
  username: ''
});


const signUp = async () => {
  isLoading.value = true;
  errorMesaage.value = '';

  if (!registerForm.value.username.trim()) {
    errorMesaage.value = 'Введите имя пользователя';
    isLoading.value = false;
    return;
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMesaage.value = 'Пароли не совпадают';
    isLoading.value = false;
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      registerForm.value.email,
      registerForm.value.password
    );
    const user = userCredential.user;

    const db = getFirestore(app);
    const profileRef = doc(db, `users/${user.uid}/ProfileInfo`, "main");
    await setDoc(profileRef, {
      userName: registerForm.value.username,
      userNameLower: registerForm.value.username.toLowerCase(),
      friends: [],
      fcmTokens: []
    });

    console.log('Регистрация выполнена и профиль создан');
    router.push("/friendsList");
  } catch (error) {
    errorMesaage.value = getErrorMessage(error.code);
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};


const signIn = async () => {
  isLoading.value = true;
  errorMesaage.value = ''
  try {
    await signInWithEmailAndPassword(auth, loginForm.value.email, loginForm.value.password)
    router.push('friendsList')
    console.log('Вход выполнен')
  } catch (error) {
    errorMesaage.value = getErrorMessage(error.code)
    console.log(error.message)
  } finally {
    isLoading.value = false
  }
}

const getErrorMessage = (errorCode) => {
  const errors = {
    'auth/invalid-email': 'Неверный формат email',
    'auth/user-disabled': 'Пользователь заблокирован',
    'auth/user-not-found': 'Пользователь не найден',
    'auth/wrong-password': 'Неверный пароль',
    'auth/invalid-credential': 'Неверный логин или пароль',
    'auth/email-already-in-use': 'Email уже используется',
    'auth/weak-password': 'Пароль слишком слабый'
  }

  return errors[errorCode] || 'Произошла ошибка, попробуйте снова';
}

</script>

<template>
  <div class="content">
    <div class="header">
      <q-img class="header__logo" src="../assets/logo/bro.png"></q-img>
      <h2 class="header__title">Йоу Бро</h2>
      <p class="header__subtitle">Будь на связи со своими братанами</p>
    </div>

    <div class="form sign-in-form" v-if="tab === 'authorization'">
      <q-card>
        <q-input v-model="loginForm.email" label="Email"></q-input>
        <q-input v-model="loginForm.password" label="Password"></q-input>

        <div v-if="errorMesaage" class="error-message">{{ errorMesaage }}</div>

        <loader v-if="isLoading" />
        <q-btn @click="signIn">YO!</q-btn>
      </q-card>

      <div class="flex items-center justify-center q-mt-md">
        <span class="sign-text">Ещё нет аккаунта?</span>
        <q-btn flat dense no-caps class="form-btn sign-up-btn" @click="tab = 'register'" label="Зарегистрироваться" />
      </div>
    </div>

    <div class="form sign-up-form" v-if="tab === 'register'">
      <q-card>
        <q-input v-model="registerForm.username" label="Username"></q-input>
        <q-input v-model="registerForm.email" label="Email"></q-input>
        <q-input v-model="registerForm.password" label="Password"></q-input>
        <q-input v-model="registerForm.confirmPassword" label="Confirm Password"></q-input>

        <div v-if="errorMesaage" class="error-message">{{ errorMesaage }}</div>

        <loader v-if="isLoading" />
        <q-btn @click="signUp">YO!</q-btn>
      </q-card>

      <div class="flex items-center justify-center q-mt-md">
        <span class="sign-text">Уже есть аккаунт?</span>
        <q-btn flat dense no-caps class="form-btn sign-up-btn" @click="tab = 'authorization'" label="Войти" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.q-page {
  /* background: linear-gradient(135deg, #667eea, #764ba2); */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.content {
  max-width: 1920px;
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
}

.header {
  text-align: center;
  margin: 0 0 30px 0;
  color: white;
}

.header__logo {
  width: clamp(30px, 30%, 65px);
  height: clamp(30px, 30%, 65px);
}

.header__title {
  font-size: clamp(2.5rem, 4vw, 3rem);
  font-weight: normal;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.form-btn {
  text-decoration: underline;
}

.q-card {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  border-radius: 12px;
  background: transparent;
  box-shadow: 0;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
}

.text-h6 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
  color: black;
}

.q-input {
  /* background: rgba(255, 255, 255, 0.3); */
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  /* width: 400px; */
  width: 100%;
  margin: 0 0 20px 0;
  padding: 0 10px;
}

.q-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
  color: #667eea;
}

.sign-up-btn {
  background: none;
  border: none;
  color: white;
  width: auto;
  padding: 0;
}

.sign-text {
  color: white;
  margin-right: 10px;
  opacity: 0.8;
}

.q-btn:hover {
  opacity: 0.8;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
}
</style>
