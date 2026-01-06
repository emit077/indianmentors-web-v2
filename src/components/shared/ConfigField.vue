<script setup lang="ts">
import { computed } from 'vue';
import type { FieldConfig } from '@/configs/student/student_profile';
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
  <v-col v-if="shouldShow" :cols="config.cols || 3" :md="config.cols || 3">
    <div v-if="config.fieldType === 'Avatar'" class="text-center">
      <v-avatar size="120" class="mb-3">
        <v-img v-if="fieldValue" :src="fieldValue" />
        <v-icon v-else size="60">mdi-account</v-icon>
      </v-avatar>
    </div>
    <div v-else>
      <div class="text-caption text-medium-emphasis mb-1">
        {{ config.label }}
        <span v-if="config.required" class="text-error">*</span>
      </div>
      <div class="text-body-1 mb-4" :class="config.class" v-if="config.fieldType === $keys.CUSTOM">
        <slot :name="config.label" v-bind="{ item: data, config: config }" />
      </div>
      <div v-else class="text-body-1 mb-4" :class="config.class">
        {{ data[config.data] }}

        <!-- <template v-if="config.fieldType === 'Display' && config.data === 'name'">
          {{ data[config.data] }}
        </template>
        <template v-else>
          {{ data[config.data] }}
        </template> -->
      </div>
      <div v-if="config.helpText" class="text-caption text-medium-emphasis">
        {{ config.helpText }}
      </div>
    </div>
  </v-col>
</template>
