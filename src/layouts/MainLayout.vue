<script setup>
import NavBar from 'src/components/NavBar.vue';
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <nav-bar /> -->
    <q-page-container class="page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.q-page-container {
  padding: 85px 0 0 0 !important;
}

.page {
  background: linear-gradient(90deg, #667eea, #764ba2);
  /* background: linear-gradient(90deg, #8c28fa, #009ce8); */
}
</style>
