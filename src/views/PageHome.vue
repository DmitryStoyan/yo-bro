<script setup>

</script>

<template>
  <q-page class="page">

    <q-img class="bg-img" src="../assets/background/homeBG.gif" />

    <div class="description-wrapper">
      <h1 class="title">Yo Bro</h1>
      <p class="subtitle">Простой способ сказать Yo Bro!</p>
      <p class="description">
        Yo Bro — это самое быстрое и лаконичное приложение для общения! Всего одно нажатие — и твои друзья получают
        дружеское "Bro". Без лишних слов, без сложных интерфейсов, только мгновенная связь и фановый вайб.
      </p>

      <p class="description">Присоединяйся и начни общаться проще, чем когда-либо! 🚀</p>
    </div>

  </q-page>
</template>

<style scoped>
.page {
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bg-img {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  z-index: -1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 0 30px;
  margin: 0 0 100px 0;
}

.logo {
  width: 30px;
  height: 30px;
}

.auth-btn {
  outline: 1px #fff solid !important;
}

.description-wrapper {
  max-width: 1200px;
  width: 80%;
  margin: 0 auto;
  text-align: center;
}

.title {
  font-size: 100px;
  font-weight: 300;
  margin: 0 0 15px 0;
}

.subtitle {
  font-size: 24px;
  font-weight: 300;
  margin: 0 0 50px 0;
}

.description {
  font-size: 20px;
  font-weight: 400;
  margin: 0 0 60px 0;
}

.description:last-of-type {
  margin: 0;
}
</style>
