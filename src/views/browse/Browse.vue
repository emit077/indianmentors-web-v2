<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createDebouncedSearch, api } from '@/utils/api/axios';
import CommonHelpers from '@/utils/helpers/helper-functions';
import { encrypt } from '@/utils/helpers/crypto';
import { mdiPlus, mdiPhone, mdiArrowRight, mdiTrayArrowDown, mdiTuneVariant } from '@mdi/js';

import ProfileCard from '@/components/shared/ProfileCard.vue';
import ComponentTitle from '@/components/shared/ComponentTitle.vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import pageConfig from './config/tutor_list';
// Router setup
const router = useRouter();

// Student data
const studentList = ref<any[]>([]);
const page = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(20);

// Search setup
const searchQuery = ref('');
const searchLoading = ref(false);
// Create search function
const searchFunction = async (query: string, signal?: AbortSignal) => {
  searchLoading.value = true;

  try {
    const response = await api.get<any>(pageConfig.API_URL, {
      params: { q: query, page: page.value },
      signal // Pass signal to cancel previous requests
    });

    studentList.value = response.students;
    totalPages.value = response.total_pages;
    totalItems.value = response.total;
  } catch (err: any) {
    // Ignore cancellation errors
    if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
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

onMounted(async () => {
  searchFunction('');
});
</script>

<template>
  <ComponentTitle :config="pageConfig.pageHeaderConfig" />
  <!-- Search and Filter Section -->
  <v-row class="mb-4">
    <v-col cols="12" md="5" class="order-2 order-md-1">
      <v-text-field
        v-model="searchQuery"
        :placeholder="pageConfig.SEARCH_LABEL"
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
      </slot>
    </v-col>
  </v-row>
  <!-- Search and Filter Section Ends -->
  <!-- Button Group Section -->
  <div class="text-left">
      <!-- Card Section -->
        <v-row no-gutters>
          <v-col cols="12" md="4" class="pa-1" v-for="data in studentList" :key="data.user_table_id">
            <ProfileCard :config="pageConfig.profileCardConfig" :data="data">
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
  </div>
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
</template>
