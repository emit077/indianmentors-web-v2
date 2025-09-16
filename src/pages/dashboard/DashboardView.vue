<template>
  <div class="dashboard-container">
    <!-- Today's Sales Section -->
    <div class="section-header">
      <h2 class="section-title">Today's Sales</h2>
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-download"
        class="export-btn"
      >
        Export
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="stats-row">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pink-card">
          <v-card-text class="stat-content">
            <div class="stat-icon">
              <v-icon size="24" color="white">mdi-chart-bar</v-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">$1k</div>
              <div class="stat-label">Total Sales</div>
              <div class="stat-change positive">+8% from yesterday</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card orange-card">
          <v-card-text class="stat-content">
            <div class="stat-icon">
              <v-icon size="24" color="white">mdi-package-variant</v-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">300</div>
              <div class="stat-label">Total Order</div>
              <div class="stat-change positive">+5% from yesterday</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card green-card">
          <v-card-text class="stat-content">
            <div class="stat-icon">
              <v-icon size="24" color="white">mdi-check-circle</v-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">5</div>
              <div class="stat-label">Product Sold</div>
              <div class="stat-change positive">+1.2% from yesterday</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card purple-card">
          <v-card-text class="stat-content">
            <div class="stat-icon">
              <v-icon size="24" color="white">mdi-account-group</v-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">8</div>
              <div class="stat-label">New Customers</div>
              <div class="stat-change positive">+0.5% from yesterday</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-row class="mt-4 flex-grow-1">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-chart-bar</v-icon>
            Analytics Overview
          </v-card-title>
          <v-card-text>
            <v-progress-linear
              v-for="item in analyticsData"
              :key="item.name"
              :model-value="item.value"
              :color="item.color"
              height="25"
              class="mb-2"
            >
              <template v-slot:default="{ value }">
                <strong>{{ item.name }}: {{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-weather-sunny</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text>
            <v-btn
              block
              class="mb-2"
              color="primary"
              @click="sendTestNotification"
            >
              <v-icon start>mdi-bell</v-icon>
              Send Test Notification
            </v-btn>
            
            <v-btn
              block
              class="mb-2"
              color="success"
              @click="loadSampleData"
              :loading="isLoading"
            >
              <v-icon start>mdi-download</v-icon>
              Load Sample Data
            </v-btn>
            
            <v-btn
              block
              color="info"
              @click="requestLocation"
              :loading="locationStore.isLoading"
            >
              <v-icon start>mdi-map-marker</v-icon>
              Update Location
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sample Data Table -->
    <v-row class="mt-4 flex-grow-0" v-if="sampleData.length > 0">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-table</v-icon>
            Sample Data from API
          </v-card-title>
          <v-data-table
            :headers="tableHeaders"
            :items="sampleData"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notifications'
import { useLocationStore } from '@/stores/location'
import { userService } from '@/services/userService'

// Initialize stores
const notificationStore = useNotificationStore()
const locationStore = useLocationStore()

const isLoading = ref(false)
const sampleData = ref<any[]>([])

const analyticsData = ref([
  { name: 'User Engagement', value: 75, color: 'primary' },
  { name: 'Feature Usage', value: 60, color: 'success' },
  { name: 'Performance', value: 85, color: 'info' },
  { name: 'Satisfaction', value: 90, color: 'warning' }
])

const tableHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Title', key: 'title' },
  { title: 'User ID', key: 'userId' }
]

const sendTestNotification = () => {
  notificationStore.addNotification({
    title: 'Test Notification',
    body: 'This is a test notification from the dashboard!',
    icon: '/favicon.ico'
  })
}

const loadSampleData = async () => {
  isLoading.value = true
  try {
    const response = await userService.getSampleData()
    sampleData.value = response.data.slice(0, 10) // Show first 10 items
  } catch (error) {
    console.error('Failed to load sample data:', error)
  } finally {
    isLoading.value = false
  }
}

const requestLocation = async () => {
  await locationStore.requestLocationPermission()
  if (locationStore.hasLocation) {
    notificationStore.addNotification({
      title: 'Location Updated',
      body: `Your location: ${locationStore.currentLocation?.latitude.toFixed(4)}, ${locationStore.currentLocation?.longitude.toFixed(4)}`,
      icon: '/favicon.ico'
    })
  }
}

onMounted(() => {
  // Load sample data on mount
  loadSampleData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.export-btn {
  text-transform: none;
  font-weight: 500;
}

.stats-row {
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: none;
  overflow: hidden;
}

.pink-card {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
}

.orange-card {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

.green-card {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.purple-card {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-content {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
  color: white;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .stat-content {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 20px;
  }
}
</style>
