<template>
  <v-row class="mb-6">
    <v-col cols="12" sm="6" md="3" v-for="stat in stats" :key="stat.title">
      <v-card class="stat-card h-100" elevation="2" rounded="lg" hover>
        <v-card-text class="pa-6">
          <div class="d-flex align-center justify-space-between mb-3">
            <div>
              <div class="text-h3 font-weight-bold mb-1" :class="`text-${stat.color}`">{{ stat.value }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ stat.title }}</div>
            </div>
            <div class="stat-icon" :class="`text-${stat.color}`">
              <svg class="pc-icon" style="width: 32px; height: 32px">
                <use :xlink:href="`/assets/svg/sprite.svg#${stat.icon}`" />
              </svg>
            </div>
          </div>

          <div class="d-flex align-center">
            <v-chip :color="stat.trend > 0 ? 'success' : 'error'" size="small" variant="tonal" class="me-2">
              <template v-slot:prepend>
                <svg class="pc-icon" style="width: 12px; height: 12px">
                  <use :xlink:href="`/assets/svg/sprite.svg#${stat.trend > 0 ? 'custom-status-up' : 'custom-level'}`" />
                </svg>
              </template>
              {{ Math.abs(stat.trend) }}%
            </v-chip>
            <span class="text-caption text-medium-emphasis">{{ stat.period }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const stats = ref([
  {
    title: 'Total Revenue',
    value: '₹2,45,000',
    icon: 'custom-inr-square',
    color: 'success',
    trend: 12.5,
    period: 'vs last month'
  },
  {
    title: 'Active Users',
    value: '1,234',
    icon: 'custom-user',
    color: 'primary',
    trend: 8.2,
    period: 'vs last month'
  },
  {
    title: 'Projects',
    value: '24',
    icon: 'custom-box-1',
    color: 'warning',
    trend: -2.1,
    period: 'vs last month'
  },
  {
    title: 'Conversion',
    value: '68.5%',
    icon: 'custom-graph',
    color: 'info',
    trend: 15.3,
    period: 'vs last month'
  }
]);
</script>

<style scoped lang="scss">
.stat-card {
  transition: all 0.3s ease;
  border: 1px solid rgb(var(--v-theme-outline-variant));

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
}
</style>
