<template>
    <v-layout ref="app" class="rounded rounded-md">
      <v-app-bar color="grey-lighten-2" name="app-bar">
        <v-btn class="mx-auto" @click="print('app-bar')">Header</v-btn>
          <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/five">About</router-link>
        </div>
      </v-app-bar>
  
      <v-navigation-drawer
        color="grey-darken-2"
        permanent
        name="drawer"
        location="end"
      >
        <div class="d-flex justify-center align-center h-100">
            <Drag />
        </div>
      </v-navigation-drawer>
  
      <v-main class="d-flex align-center justify-center" style="min-height: 600px; min-width: 600px;">
        <slot name="main"></slot>
      </v-main>
  
      <v-footer
        app
        name="footer"
      >
        <v-btn
          class="mx-auto"
          variant="text"
          @click="print('footer')"
        >
          Footer
        </v-btn>
      </v-footer>
    </v-layout>
  </template>
  
  <script lang="ts">
import Drag from './Drag.vue';



  export default {
    name: 'App',
    methods: {
        print(_key: string) {
            //alert(JSON.stringify(this.$refs.app.getLayoutItem(key), null, 2))
        },
    },
    components: { Drag }
}
  </script>
  
  <style>
  /* 스타일링 추가 */
  </style>
  