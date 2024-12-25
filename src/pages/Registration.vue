<script setup>
import app from '../utils/firebase'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue';
const auth = getAuth(app);


const tab = ref('mails')
const isLoading = ref(false)

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  email: '',
  password: ''
})

const signUp = async () => {
  isLoading.value = true
  try {
    await createUserWithEmailAndPassword(auth, loginForm.value.email, loginForm.value.password)
    console.log('1234')
  } catch (error) {
    console.log(error.message)
  } finally {
    isLoading.value = false
  }
}

const submitForm = () => {
  signUp()
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

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <div class="text-h6">Войти в аккаунт</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          <q-input outlined v-model="loginForm.email" label="Email" />
          <q-input type="password" outlined v-model="loginForm.password" label="Пароль" />
          <q-btn label="Войти" color="primary" @click="submitForm()" class="q-mt-md" />


        </q-tab-panel>

        <q-tab-panel name="alarms">
          <div class="text-h6">Регистрация</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          <q-input outlined v-model="registerForm.email" label="Email" />
          <q-input type="password" outlined v-model="registerForm.password" label="Пароль" />
          <q-btn label="Регистрация" color="primary" @click="" class="q-mt-md" />


        </q-tab-panel>

      </q-tab-panels>
    </q-card>
  </div>
</template>
