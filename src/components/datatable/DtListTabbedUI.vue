<script setup lang="ts">
import { ref } from 'vue';
import CommonHelpers from '@/utils/helpers/helper-functions';
import { mdiTableLarge, mdiListBoxOutline, mdiAccountBoxOutline } from '@mdi/js';

const isMobileScreen = CommonHelpers.isMobile();
const currentTab = ref<string>(isMobileScreen.value ? 'card' : 'table');

const btnConfig = [
  {
    icon: mdiTableLarge,
    value: 'table'
  },
  {
    icon: mdiListBoxOutline,
    value: 'list'
  },
  {
    icon: mdiAccountBoxOutline,
    value: 'card'
  }
];
</script>
<template>
  <v-btn-toggle v-if="!isMobileScreen" v-model="currentTab" color="primary" variant="outlined" mandatory>
    <v-btn v-for="btn in btnConfig" :value="btn.value" :icon="btn.icon"></v-btn>
  </v-btn-toggle>

  <v-tabs-window v-model="currentTab">
    <v-tabs-window-item v-for="btn in btnConfig" :value="btn.value" :key="btn.value">
      <slot :name="`${btn.value}`"></slot>
    </v-tabs-window-item>
  </v-tabs-window>
</template>
