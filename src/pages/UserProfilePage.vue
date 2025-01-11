<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()

const url = 'https://cakeshop.com.ua/images/AcpSe7kFpmzMfgJUwhyXbNbja_gwkleunua5ZVM9jTQ/h:5000/bG9jYWw/6Ly8vY2FrZXNob3AuY29tLnVhL3B1YmxpY19odG1sL3N0b3JhZ2UvYXBwL3B1YmxpYy9pbWcvcHJvZHVjdC81NzEzXzEuanBn'
</script>

<template>
  <q-page>
    <h2>Мой профиль</h2>
    <div>
      <q-img :src="url" class="prifile-avatar">
        <template v-slot:loading>
          <q-spinner-gears color="white"></q-spinner-gears>
        </template>
      </q-img>
      <q-input class="q-mb-md" outlined label="Email" />
      <q-input class="q-mb-md" outlined label="Имя пользователя" />
      <q-btn label="Сохранить" color="blue" />
    </div>
    <h2> Email: {{ userStore.userEmail }}</h2>
  </q-page>
</template>

<style scoped>
.prifile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
</style>
