<template>
    <v-layout ref="app" class="rounded rounded-md">
      <v-app-bar color="grey-lighten-2" name="app-bar">
        <v-btn class="mx-auto" @click="print('app-bar')">Header</v-btn>
          <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/five">About</router-link>
        </div>
      </v-app-bar>
      <v-navigation-drawer>
        <Drag />
    </v-navigation-drawer>

      <v-navigation-drawer location="right">
        <DataInfo />
      </v-navigation-drawer>
  
      <v-main class="d-flex align-center justify-center" style="min-height: 600px; min-width: 1200px;">
        <slot name="main" ></slot>
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
  
  <script setup lang="ts">
  import Drag from './Drag.vue';
  import DataInfo from './DataInfo.vue';


  
  const print = (key: string) => {
    //alert(JSON.stringify(app.getLayoutItem(key), null, 2));
  };




  </script>
  
  <style>
  /* 스타일링 추가 */
  </style>
  