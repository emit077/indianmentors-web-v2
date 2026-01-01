<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useCustomizerStore } from '../../stores/customizer';
const customizer = useCustomizerStore();
</script>
<template>
  <v-locale-provider>
    <v-app
      :theme="customizer.actTheme"
      :class="[
        customizer.actTheme,
        customizer.fontTheme,
        customizer.mini_sidebar ? 'mini-sidebar' : '',
        customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
        customizer.inputBg ? 'inputWithbg' : ''
      ]"
    >
      <v-main class="page-wrapper">
        <v-container fluid class="px-0">
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
