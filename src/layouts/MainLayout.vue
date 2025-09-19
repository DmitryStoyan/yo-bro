<script setup>
import NavBar from 'src/components/NavBar.vue';
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <nav-bar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style></style>
