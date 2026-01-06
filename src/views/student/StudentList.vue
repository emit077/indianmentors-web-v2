<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { createDebouncedSearch, api } from '@/utils/api/axios';
import CommonHelpers from '@/utils/helpers/helper-functions';
import { encrypt } from '@/utils/helpers/crypto';
import { mdiPlus, mdiPhone, mdiArrowRight } from '@mdi/js';

import URLS from '@/utils/urls';
import { mdiTrayArrowDown, mdiTuneVariant } from '@mdi/js';
import ProfileCard from '@/components/shared/ProfileCard.vue';
import ProfileList from '@/components/shared/ProfileList.vue';
import DataTable from '@/components/datatable/DataTable.vue';
import DTBtnGroup from '@/components/datatable/DTBtnGroup.vue';
import { profileCardConfig, profileListConfig, headers } from './config/student_list';

// Router setup
const router = useRouter();

// Mobile detection
const isMobileScreen = CommonHelpers.isMobile();
// Sample data - replace with API call
const studentList = ref<any[]>([]);
var tab = ref<string>(isMobileScreen.value ? 'card' : 'table');
const page = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(20);
// Search setup
const searchQuery = ref('');
const searchLoading = ref(false);
const searchError = ref<string | null>(null);

// Create search function
const searchFunction = async (query: string, signal?: AbortSignal) => {
  // set loading to true
  searchLoading.value = true;
  searchError.value = null;

  try {
    const response = await api.get<any>(URLS.STUDENT_LIST, {
      params: { q: query, page: page.value },
      signal // Pass signal to cancel previous requests
    });

    console.log(response);
    studentList.value = response.students;
    totalPages.value = response.total_pages;
    totalItems.value = response.total;
  } catch (err: any) {
    // Ignore cancellation errors
    if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
      searchError.value = err.message || 'Search failed';
      console.error('Search error:', err);
    }
  } finally {
    searchLoading.value = false;
  }
};
// Create debounced search (300ms delay)
const debouncedSearch = createDebouncedSearch(searchFunction, 300);

// Handle search input - call debounced function directly (better than watch)
const handleSearch = async () => {
  const query = searchQuery.value?.trim() || '';
  if (query.length > 0) {
    await debouncedSearch(query);
  } else {
    // If search is cleared, fetch all students
    await searchFunction('');
  }
};

// handle toggle of tab
const handleToggle = (value: string) => {
  tab.value = value;
};

// Displayed students - prefer API results; fallback to local sample data
const displayedStudents = computed(() => {
  return studentList.value;
});

onMounted(async () => {
  searchFunction('');
});
</script>

<template>
  <v-container fluid>
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center flex-wrap gap-4">
          <div>
            <h1 class="text-h4 mb-2">Student List</h1>
            <!-- <p class="text-body-2 text-medium-emphasis">#Manage and view all student profiles</p> -->
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Search and Filter Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="5" class="order-2 order-md-1">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search students..."
          variant="outlined"
          clearable
          hide-details
          @update:model-value="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template v-slot:prepend-inner>
            <div class="text-lightText d-flex align-center">
              <SvgSprite name="custom-search" style="width: 16px; height: 16px" />
            </div>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="7" class="justify-end d-flex order-1 order-md-2">
        <slot name="tableController">
          <v-btn class="" color="primary" size="small" :icon="mdiTuneVariant" rounded="sm" variant="tonal" title="Filter"> </v-btn>
          <v-btn class="mx-2" color="primary" size="small" rounded="sm" variant="tonal" :icon="mdiTrayArrowDown" title="Download"> </v-btn>
          <v-tooltip location="top" color="red">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="primary"
                size="small"
                variant="flat"
                rounded="sm"
                :icon="mdiPlus"
                @click="router.push('/student/add')"
                title="Add New Student"
              >
              </v-btn>
            </template>
            <span>Add New Student</span>
          </v-tooltip>
        </slot>
      </v-col>
    </v-row>
    <!-- Search and Filter Section Ends -->
    <!-- Button Group Section -->
    <div class="text-left">
      <DTBtnGroup @update:model-value="handleToggle" />
    </div>
    <!-- Button Group Section Ends -->
    <!-- Tabs Section -->
    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="'table'">
        <DataTable
          :headers="headers"
          :items="studentList"
          :total-items="20"
          :loading="searchLoading"
          :items-per-page="20"
          :search="searchQuery"
          item-value="user_table_id"
          search-placeholder="Search students..."
          no-data-message="No students found. Try adjusting your search criteria or add your first student."
        >
          <!-- @update:items-per-page="(v) => (itemsPerPage = v)"
          @update:search="(v) => (searchQuery = v)"
          @action="handleAction" -->

          <template #item.class_name="{ item }">
            <div>
              <span class="text-body-2 font-weight-medium"> {{ item.class_name }} - {{ item.board_name?.toUpperCase() || '' }} </span>
            </div>
          </template>
          <!-- Action Buttons -->
          <template #item.DT_BTNS="{ item }">
            <div>
              <v-btn size="small" color="primary" variant="tonal" :icon="mdiPhone" title="View Profile"></v-btn>
              <RouterLink
                class="ml-2"
                :to="{ name: 'StudentProfile', params: { id: encrypt(item.id) } }"
                style="text-decoration: none; display: inline-block"
              >
                <v-btn size="small" color="primary" variant="tonal" :icon="mdiArrowRight" title="View Profile"></v-btn>
              </RouterLink>
            </div>
          </template>
          <!-- Action Buttons Ends -->
        </DataTable>
      </v-tabs-window-item>
      <v-tabs-window-item :value="'list'">
        <!-- Profile list UI -->
        <div v-for="data in displayedStudents" :key="data.user_table_id">
          <ProfileList :config="profileListConfig" :data="data">
            <template #actionBtn="{ item, con }">
              <div class="mb-3 text-right">
                <v-btn
                  width="x-small"
                  color="primary"
                  variant="outlined"
                  :to="{ name: 'StudentProfile', params: { id: encrypt(item.id) } }"
                >
                  visit Profile
                </v-btn>
              </div>
            </template>
          </ProfileList>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="'card'">
        <!-- Profile card UI -->
        <v-row class="" no-gutters>
          <v-col cols="12" md="4" class="pa-1" v-for="data in displayedStudents" :key="data.user_table_id">
            <ProfileCard :config="profileCardConfig" :data="data">
              <template #classAndBoard="{ item, con }">
                <div class="">
                  <div class="text-caption text-medium-emphasis mb-1">Class & board</div>
                  <div class="text-subtitle-2 text-truncate">{{ item.class_name }} - {{ item.board_name?.toUpperCase() }}</div>
                </div>
              </template>

              <template #actionBtn="{ item, con }">
                <div class="mb-3 d-flex justify-space-between">
                  <v-btn color="primary" variant="outlined" width="48%" @click="CommonHelpers.launchDialpad(item.mobile)"> Call</v-btn>
                  <v-btn color="primary" variant="outlined" width="48%" :to="{ name: 'StudentProfile', params: { id: encrypt(item.id) } }">
                    visit Profile
                  </v-btn>
                </div>
              </template>
            </ProfileCard>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>
    <!-- Tabs Section Ends -->
    <!-- Pagination Section -->
    <v-row class="my-4 px-1">
      <v-col cols="12" md="6" class="text-caption text-secondary">
        Showing
        <span class="font-weight-bold px-1">
          {{ Math.min((page - 1) * itemsPerPage + 1, totalItems) }} - {{ Math.min(page * itemsPerPage, totalItems) }}
        </span>
        of
        <span class="font-weight-bold px-1"> {{ totalItems }} </span>
      </v-col>
      <v-col cols="12" md="6" class="justify-center justify-md-end d-flex">
        <v-pagination
          class="dt_table_pagination"
          active-color="primary"
          color="secondary"
          variant="text"
          size="small"
          rounded
          v-model="page"
          :length="totalPages"
          :total-visible="7"
          @update:model-value="searchFunction(searchQuery)"
        ></v-pagination
      ></v-col>
    </v-row>
    <!--  -->
  </v-container>
</template>

<style scoped lang="scss"></style>
