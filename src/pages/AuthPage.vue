<script setup>
import { computed, watch } from "vue";
defineOptions({
  name: 'AuthPage'
});

import Authorization from '../components/Authorization.vue'

</script>

<template>
  <q-page class="flex column">
    <!-- <h2 class="title">Страница авторизации</h2> -->
    <Authorization />
  </q-page>
</template>

<style scoped>
.q-page {
  background: linear-gradient(135deg, #667eea, #764ba2);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 3.75rem;
  font-weight: 300;
  line-height: 3.75rem;
  margin: 0 0 3rem 0;
  text-align: center;
}
</style>
