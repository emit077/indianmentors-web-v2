<script setup lang="ts">
import { computed } from 'vue';

interface FieldConfig {
  data: string;
  label: string;
  fieldType?: string;
  cols?: number | string;
  class?: string;
  formatType?: string;
  required?: boolean;
  helpText?: string;
  condition?: (data: any) => boolean;
  defaultValue?: any;
}

import $keys from '@/utils/keys';

const props = defineProps<{
  config: FieldConfig;
  data: any;
}>();

const fieldValue = computed(() => {
  const value = props.data[props.config.data];
  if (value === null || value === undefined) {
    return props.config.defaultValue ?? '';
  }
  return value;
});

const formatValue = (value: any, formatType?: string): string => {
  if (value === null || value === undefined) return 'Not provided';

  switch (formatType) {
    case 'date':
      if (!value) return 'Not provided';
      return new Date(value).toLocaleDateString('en-GB');
    case 'array':
      if (!Array.isArray(value) || value.length === 0) return 'Not provided';
      return value.join(', ');
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'phone':
      return value || 'Not provided';
    case 'email':
      return value || 'Not provided';
    default:
      return value || 'Not provided';
  }
};

const displayValue = computed(() => formatValue(fieldValue.value, props.config.formatType));

const shouldShow = computed(() => {
  if (props.config.condition) {
    return props.config.condition(props.data);
  }
  return true;
});
</script>

<template>
  <v-col v-if="shouldShow" cols="12" :md="config.cols || 3">
    <v-card v-if="config.fieldType === 'Avatar'" variant="flat" class="text-center">
      <v-avatar size="120" class="elevation-4">
        <v-img v-if="fieldValue" :src="fieldValue" />
        <v-icon v-else size="60" color="primary">mdi-account</v-icon>
      </v-avatar>
    </v-card>

    <v-card v-else rounded="sm" variant="tonal" color="secondary" class="pa-3" :class="config.class">
      <div class="mb-2">
        <span class="text-caption">
          {{ config.label }}
        </span>
        <!-- <v-chip v-if="config.required" color="error" size="x-small" class="ml-1">*</v-chip> -->
      </div>

      <div v-if="config.fieldType === $keys.CUSTOM">
        <slot :name="config.label" v-bind="{ item: data, config: config }" />
      </div>

      <div v-else>
        <div v-if="displayValue === 'Not provided'" class="text-body-2 text-medium-emphasis d-flex align-center">
          <v-icon size="x-small" class="mr-1">mdi-minus-circle-outline</v-icon>
          {{ displayValue }}
        </div>
        <div v-else class="text-body-1 font-weight-medium">{{ displayValue }}</div>
      </div>

      <div v-if="config.helpText" class="text-caption text-medium-emphasis mt-2 d-flex align-center">
        <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
        {{ config.helpText }}
      </div>
    </v-card>
  </v-col>
</template>
