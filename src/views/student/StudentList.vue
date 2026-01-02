<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { createDebouncedSearch, api } from '@/utils/api/axios';

import URLS from '@/utils/urls';
import { mdiCheckDecagram, mdiTableLarge, mdiListBoxOutline, mdiAccountBoxOutline, mdiTrayArrowDown, mdiTuneVariant } from '@mdi/js';
import ProfileCard from '@/components/shared/ProfileCard.vue';
import ProfileList from '@/components/shared/ProfileList.vue';
import DataTable from '@/components/datatable/DataTable.vue';
import { profileCardConfig, profileListConfig, headers } from '@/configs/student/student_list';

// Student data interface
interface Student {
  user_table_id: string;
  student_id: string;
  is_active: boolean;
  name: string;
  mobile: string;
  email: string;
  father_name: string;
  mother_name: string;
  gender: string;
  date_of_birth: string;
  dob: string;
  father_contact_number: string;
  mother_contact_number: string;
  whatsapp_number: string;
  parent_email: string | null;
  contact_person: string;
  contact_person_name: string | null;
  contact_person_mobile: string | null;
  address: string;
  pin_code: string;
  city: string;
  state: string;
  class_name: string;
  education_board: string;
  special_concern: string;
  profile_status: string;
  signup_date: string;
}

// Sample data - replace with API call
const studentList = ref<Student[]>([]);
const loading = ref(false);
const tab = ref('table');
const page = ref(1);

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
      params: { q: query },
      signal // Pass signal to cancel previous requests
    });

    console.log(response);
    studentList.value = response.students;
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
            <p class="text-body-2 text-medium-emphasis">Manage and view all student profiles</p>
          </div>
          <v-btn color="primary" prepend-icon="mdi-plus" size="large"> Add New Student </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Search and Filter Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="5">
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
      <v-col cols="12" md="7" class="justify-end d-flex pr-0">
        <slot name="tableController">
          <v-btn
            class="hidden-md-and-down mr-2 ml-0"
            color="primary"
            :icon="mdiTuneVariant"
            aria-label="sidebar button"
            rounded="sm"
            variant="tonal"
          >
          </v-btn>
          <v-btn
            class="hidden-md-and-down mr-5 ml-0"
            color="primary"
            aria-label="sidebar button"
            rounded="sm"
            variant="tonal"
            :icon="mdiTrayArrowDown"
          >
          </v-btn>
        </slot>
      </v-col>
    </v-row>
    <!--  -->

    <div>
      <v-btn-toggle v-model="tab" border color="primary" variant="text" mandatory>
        <v-btn value="table" :icon="mdiTableLarge"></v-btn>
        <v-btn value="list" :icon="mdiListBoxOutline"></v-btn>
        <v-btn value="card" :icon="mdiAccountBoxOutline"></v-btn>
      </v-btn-toggle>
    </div>

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
              <div class="text-body-2 font-weight-medium">{{ item.classes }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ item.board?.toUpperCase() || '' }}
              </div>
            </div>
          </template>
        </DataTable>
      </v-tabs-window-item>
      <v-tabs-window-item :value="'list'">
        <!-- Profile list UI -->
        <div v-for="data in displayedStudents" :key="data.user_table_id">
          <ProfileList :config="profileListConfig" :data="data">
            <template #actionBtn="{ item, con }">
              <div class="mb-3 text-right">
                <v-btn width="x-small" color="primary" variant="outlined"> visit Profile </v-btn>
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
                  <div class="text-subtitle-2 text-truncate">{{ item.classes }} - {{ item.board?.toUpperCase() }}</div>
                </div>
              </template>

              <template #actionBtn="{ item, con }">
                <div class="mb-3">
                  <v-btn width="x-small" color="primary" variant="outlined" block> visit Profile</v-btn>
                </div>
              </template>
            </ProfileCard>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>

    <div class="text-center justify-center">
      <v-pagination class="" color="primary" variant="text" v-model="page" :length="15" :total-visible="7"></v-pagination>
    </div>
    <!--  -->

    <!--  -->
  </v-container>
</template>

<style scoped lang="scss"></style>
