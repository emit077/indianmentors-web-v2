<script setup lang="ts">
import { ref } from 'vue';
import ComponentTitle from '@/components/shared/ComponentTitle.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const pageConfig = ref({
  pageTitle: 'Color System',
  pageDescription:
    'Complete color palette for the Indian Mentors platform. All colors are defined in the theme and available throughout the application.',
  breadcrumbs: [
    {
      title: 'Home',
      disabled: false,
      to: { name: 'Default' }
    },
    {
      title: 'Utilities',
      disabled: true
    },
    {
      title: 'Colors',
      disabled: true
    }
  ]
});

const colorGroups = ref([
  {
    title: 'Primary Colors',
    description: 'Main brand colors',
    colors: [
      'primary',
      'lightprimary',
      'darkprimary',
      'primary50',
      'primary100',
      'primary200',
      'primary300',
      'primary400',
      'primary500',
      'primary600',
      'primary700',
      'primary800',
      'primary900'
    ]
  },
  {
    title: 'Secondary Colors',
    description: 'Supporting colors',
    colors: [
      'secondary',
      'lightsecondary',
      'darksecondary',
      'secondary50',
      'secondary100',
      'secondary200',
      'secondary300',
      'secondary400',
      'secondary500',
      'secondary600',
      'secondary700',
      'secondary800',
      'secondary900'
    ]
  },
  {
    title: 'Success Colors',
    description: 'Positive actions & states',
    colors: [
      'success',
      'lightsuccess',
      'darksuccess',
      'success50',
      'success100',
      'success200',
      'success300',
      'success400',
      'success500',
      'success600',
      'success700',
      'success800',
      'success900'
    ]
  },
  {
    title: 'Info Colors',
    description: 'Informational states',
    colors: [
      'info',
      'lightinfo',
      'darkinfo',
      'info50',
      'info100',
      'info200',
      'info300',
      'info400',
      'info500',
      'info600',
      'info700',
      'info800',
      'info900'
    ]
  },
  {
    title: 'Warning Colors',
    description: 'Caution states',
    colors: [
      'warning',
      'lightwarning',
      'darkwarning',
      'warning50',
      'warning100',
      'warning200',
      'warning300',
      'warning400',
      'warning500',
      'warning600',
      'warning700',
      'warning800',
      'warning900'
    ]
  },
  {
    title: 'Error Colors',
    description: 'Destructive actions & errors',
    colors: [
      'error',
      'lighterror',
      'darkerror',
      'error50',
      'error100',
      'error200',
      'error300',
      'error400',
      'error500',
      'error600',
      'error700',
      'error800',
      'error900'
    ]
  },
  {
    title: 'Neutral Colors',
    description: 'Text, backgrounds & surfaces',
    colors: ['white', 'black', 'surface', 'background', 'containerBg', 'cardBg', 'hoverBg', 'activeBg']
  },
  {
    title: 'Text Colors',
    description: 'Text color variations',
    colors: ['darkText', 'lightText', 'mediumText', 'mutedText']
  },
  {
    title: 'Border Colors',
    description: 'Borders & dividers',
    colors: ['borderLight', 'borderMedium', 'borderDark', 'inputBorder', 'divider']
  },
  {
    title: 'Gray Scale',
    description: 'Grayscale palette',
    colors: ['gray50', 'gray100', 'gray200', 'gray300', 'gray400', 'gray500', 'gray600', 'gray700', 'gray800', 'gray900']
  },
  {
    title: 'Social Media',
    description: 'Social platform colors',
    colors: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'whatsapp']
  },
  {
    title: 'Status Colors',
    description: 'User status indicators',
    colors: ['online', 'offline', 'away', 'busy']
  },
  {
    title: 'Chart Colors',
    description: 'Data visualization colors',
    colors: ['chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'chart6', 'chart7', 'chart8']
  }
]);
</script>

<template>
  <ComponentTitle :config="pageConfig" />

  <v-row>
    <v-col cols="12" v-for="(group, groupIndex) in colorGroups" :key="groupIndex">
      <UiParentCard :title="group.title">
        <template #title>
          <div class="d-flex align-center justify-space-between">
            <div>
              <h3 class="text-h6 font-weight-bold">{{ group.title }}</h3>
              <p class="text-caption text-medium-emphasis mb-0">{{ group.description }}</p>
            </div>
            <v-chip size="small" variant="tonal" color="primary">{{ group.colors.length }} colors</v-chip>
          </div>
        </template>

        <v-row>
          <v-col cols="6" sm="4" md="3" lg="2" v-for="(color, index) in group.colors" :key="index">
            <v-card rounded="md" variant="outlined" class="overflow-hidden">
              <v-sheet :color="color" height="80" class="d-flex align-center justify-center">
                <v-icon v-if="['white', 'gray50', 'gray100'].includes(color)" color="black">mdi-palette</v-icon>
                <v-icon v-else color="white">mdi-palette</v-icon>
              </v-sheet>
              <v-card-text class="pa-2 text-center">
                <div class="text-caption font-weight-medium">{{ color }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
