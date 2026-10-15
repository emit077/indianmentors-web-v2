<script setup lang="ts">
const show = defineModel<boolean>({ default: false });

withDefaults(
  defineProps<{
    message: string;
    type?: 'success' | 'error';
  }>(),
  { type: 'error' }
);
</script>

<template>
  <v-snackbar v-model="show" :color="type" location="bottom" :timeout="4000" rounded="md">
    <div class="text-center">
      {{ message }}
    </div>
  </v-snackbar>
</template>
