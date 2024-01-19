<script setup lang="ts">
import Vuetify from './components/Vuetify.vue';
//import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/five">About</router-link>
  </div> -->

  <Vuetify>
    <template #main>
        <router-view />
      <!-- <HelloWorld msg="안녕하세요" /> -->
    </template>
  </Vuetify>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
