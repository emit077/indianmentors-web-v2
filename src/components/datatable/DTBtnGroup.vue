<script setup lang="ts">
import { ref, computed } from 'vue';
import CommonHelpers from '@/utils/helpers/helper-functions';
import { mdiTableLarge, mdiListBoxOutline, mdiAccountBoxOutline } from '@mdi/js';

const isMobileScreen = CommonHelpers.isMobile();
const toggleValue = ref<string>('table');

const $emit = defineEmits(['update:modelValue']);

const handleToggle = (value: string) => {
  $emit('update:modelValue', value);
};
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
  <v-btn-toggle
    v-if="!isMobileScreen"
    v-model="toggleValue"
    color="primary"
    variant="outlined"
    mandatory
    @update:model-value="handleToggle"
  >
    <v-btn v-for="btn in btnConfig" :value="btn.value" :icon="btn.icon"></v-btn>
  </v-btn-toggle>
</template>
