<script setup>
import app from '../utils/firebase'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Loader from './Loader.vue';

const router = useRouter()
const auth = getAuth(app);

const tab = ref('mails')
const isLoading = ref(false)
const errorMesaage = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  email: '',
  password: ''
})

const signUp = async () => {
  isLoading.value = true;
  errorMesaage.value = '';
  try {
    await createUserWithEmailAndPassword(auth, registerForm.value.email, registerForm.value.password)
    console.log('Регистрация выполнена')
  } catch (error) {
    errorMesaage.value = getErrorMessage(error.code)
    console.log(error.message)
  } finally {
    isLoading.value = false
  }
}

const signIn = async () => {
  isLoading.value = true;
  errorMesaage.value = ''
  try {
    await signInWithEmailAndPassword(auth, loginForm.value.email, loginForm.value.password)
    router.push('/')
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
  <div>

    <q-card>
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="mails" label="Войти" />
        <q-tab name="alarms" label="Регистрация" />
      </q-tabs>

      <q-separator />

      <q-tab-panels class="content" v-model="tab" animated>
        <q-tab-panel name="mails">
          <div class="text-h6">Войти в аккаунт</div>
          <q-input class="input" outlined v-model="loginForm.email" label="Email" />
          <q-input type="password" outlined v-model="loginForm.password" label="Пароль" />

          <div v-if="errorMesaage" class="error-message">{{ errorMesaage }}</div>

          <loader v-if="isLoading" />
          <q-btn v-else label="Войти" color="primary" @click="signIn()" class="q-mt-md" />

        </q-tab-panel>

        <q-tab-panel name="alarms">
          <div class="text-h6">Регистрация</div>
          <q-input outlined v-model="registerForm.email" label="Email" />
          <q-input type="password" outlined v-model="registerForm.password" label="Пароль" />

          <div v-if="errorMesaage" class="error-message">{{ errorMesaage }}</div>

          <loader v-if="isLoading" />
          <q-btn v-else label="Регистрация" color="primary" @click="signUp()" class="q-mt-md" />
        </q-tab-panel>

      </q-tab-panels>
    </q-card>

  </div>
</template>

<style scoped>
.q-page {
  background: linear-gradient(135deg, #667eea, #764ba2);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.q-card {
  width: 100%;
  max-width: 700px;
  padding: 20px;
  border-radius: 12px;
  background: #c4cdff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.q-tab-panel {
  background: #c4cdff;
}

.text-h6 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
  color: black;
}

.q-input {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  width: 400px;
  margin: 0 0 20px 0;
}

.q-input:last-of-type {
  margin: 0;
}

.q-input input {
  color: black;
}

.q-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.q-btn:hover {
  opacity: 0.8;
}

.q-tabs {
  background: transparent;
}

.q-tab {
  color: white;
  font-weight: bold;
}

.q-separator {
  background: rgba(255, 255, 255, 0.3);
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
}
</style>
