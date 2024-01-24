<template>
    <v-layout ref="app" class="rounded rounded-md">
      <v-app-bar color="grey-lighten-2" name="app-bar">
        <v-btn class="mx-auto">Header</v-btn>
          <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/vis">About</router-link>
        </div>
      </v-app-bar>
      <v-navigation-drawer>
        <DragArea />
    </v-navigation-drawer>

      <v-navigation-drawer location="right">
        <DataInfo />
      </v-navigation-drawer>
  
      <v-main class="d-flex align-center justify-center" style="min-height: 720px; min-width: 1280px;">
        <slot name="main" ></slot>
      </v-main>
  
      <v-footer
        app
        name="footer"
      >
        <v-btn
          class="mx-auto"
          variant="text"
        >
          Footer
        </v-btn>
      </v-footer>
    </v-layout>
  </template>
  
  <script setup lang="ts">
  import DragArea from '../components/Drag/DragArea.vue';
  import DataInfo from '../components/DropData/DataInfo.vue';

  </script>
  
  <style>
  /* 스타일링 추가 */
  </style>
  