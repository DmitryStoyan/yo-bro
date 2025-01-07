<script setup>
import { computed, watch } from "vue";
defineOptions({
  name: 'AuthPage'
});

import Authorization from '../components/Authorization.vue'
import checkAuth from 'src/components/checkAuth.vue';

</script>

<template>
  <q-page class="flex flex-center">
    <h2>Страница авторизации</h2>
    <Authorization />
    <checkAuth />
  </q-page>
</template>
