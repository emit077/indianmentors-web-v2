<template>
  <v-card class="recent-activity-card" elevation="2" rounded="lg">
    <v-card-title class="d-flex align-center pa-6 pb-4">
      <svg class="pc-icon me-3" style="width: 20px; height: 20px">
        <use xlink:href="/assets/svg/sprite.svg#custom-history" />
      </svg>
      <span class="text-h6">Recent Activity</span>
      <v-spacer />
      <v-btn variant="text" size="small" color="primary">
        View All
        <template v-slot:append>
          <svg class="pc-icon" style="width: 16px; height: 16px">
            <use xlink:href="/assets/svg/sprite.svg#custom-chevron-right" />
          </svg>
        </template>
      </v-btn>
    </v-card-title>

    <v-card-text class="pa-6 pt-0">
      <v-timeline density="compact" class="activity-timeline">
        <v-timeline-item v-for="(activity, index) in activities" :key="index" :dot-color="activity.color" size="small">
          <template v-slot:icon>
            <svg class="pc-icon" style="width: 16px; height: 16px">
              <use :xlink:href="`/assets/svg/sprite.svg#${activity.icon}`" />
            </svg>
          </template>

          <div class="activity-item">
            <div class="d-flex align-center justify-space-between mb-1">
              <span class="text-body-2 font-weight-medium">{{ activity.title }}</span>
              <span class="text-caption text-medium-emphasis">{{ activity.time }}</span>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-2">{{ activity.description }}</p>
            <div v-if="activity.user" class="d-flex align-center">
              <v-avatar size="20" class="me-2">
                <v-img :src="activity.user.avatar" :alt="activity.user.name" />
              </v-avatar>
              <span class="text-caption">{{ activity.user.name }}</span>
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activities = ref([
  {
    title: 'New Project Created',
    description: 'E-commerce website development project started',
    time: '2 hours ago',
    icon: 'custom-plus',
    color: 'success',
    user: {
      name: 'John Doe',
      avatar: '/src/assets/images/users/avatar-1.png'
    }
  },
  {
    title: 'Task Completed',
    description: 'User authentication module completed successfully',
    time: '4 hours ago',
    icon: 'custom-circle-check-outline',
    color: 'primary',
    user: {
      name: 'Sarah Wilson',
      avatar: '/src/assets/images/users/avatar-2.png'
    }
  },
  {
    title: 'Payment Received',
    description: 'Payment of ₹25,000 received for project milestone',
    time: '6 hours ago',
    icon: 'custom-inr-square',
    color: 'success',
    user: {
      name: 'Mike Johnson',
      avatar: '/src/assets/images/users/avatar-3.png'
    }
  },
  {
    title: 'Meeting Scheduled',
    description: 'Client meeting scheduled for tomorrow at 2 PM',
    time: '1 day ago',
    icon: 'custom-calendar-1',
    color: 'warning',
    user: {
      name: 'Emily Davis',
      avatar: '/src/assets/images/users/avatar-4.png'
    }
  }
]);
</script>

<style scoped lang="scss">
.recent-activity-card {
  border: 1px solid rgb(var(--v-theme-outline-variant));

  .activity-timeline {
    .v-timeline-item__body {
      padding-bottom: 16px;
    }
  }

  .activity-item {
    padding-left: 8px;
  }
}
</style>
