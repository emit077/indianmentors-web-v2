<script setup lang="ts">
import CommonHelpers from '@/utils/helpers/helper-functions';
import { mdiTableLarge, mdiListBoxOutline, mdiAccountBoxOutline, mdiChartBellCurve } from '@mdi/js';

const isMobileScreen = CommonHelpers.isMobile();

// Expose current tab to parent via v-model
const currentTab = defineModel<string>({ default: 'table' });

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
  },
  {
    icon: mdiChartBellCurve,
    value: 'graph'
  }
];
</script>
<template>
  <v-btn-toggle v-if="!isMobileScreen" v-model="currentTab" color="primary" variant="outlined" mandatory>
    <v-btn v-for="btn in btnConfig" :key="btn.value" :value="btn.value" :icon="btn.icon"></v-btn>
  </v-btn-toggle>

  <v-tabs-window v-model="currentTab">
    <v-tabs-window-item v-for="btn in btnConfig" :key="btn.value" :value="btn.value">
      <slot :name="`${btn.value}`"></slot>
    </v-tabs-window-item>
  </v-tabs-window>
</template>
