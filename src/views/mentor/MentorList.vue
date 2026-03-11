<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createDebouncedSearch, api } from '@/utils/api/axios';
import CommonHelpers from '@/utils/helpers/helper-functions';
import { encrypt } from '@/utils/helpers/crypto';
import { mdiPhone, mdiArrowRight, mdiTrayArrowDown, mdiTuneVariant } from '@mdi/js';

import URLS from '@/utils/urls';
import ProfileCard from '@/components/shared/ProfileCard.vue';
import ProfileList from '@/components/shared/ProfileList.vue';
import DataTable from '@/components/datatable/DataTable.vue';
import DtListTabbedUI from '@/components/datatable/DtListTabbedUI.vue';
import ComponentTitle from '@/components/shared/ComponentTitle.vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import pageConfig from './config/mentor_list';

const router = useRouter();

const tutorList = ref<any[]>([]);
const page = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(20);

const searchQuery = ref('');
const searchLoading = ref(false);
const activeTab = ref<string>('table');

const searchFunction = async (query: string, signal?: AbortSignal) => {
  searchLoading.value = true;

  try {
    // NOTE: Currently reusing STUDENT_LIST endpoint, adjust to TUTOR_LIST when backend is ready.
    const response = await api.get<any>(URLS.TUTOR_LIST, {
      params: { q: query, page: page.value },
      signal
    });

    tutorList.value = response.tutors;
    totalPages.value = response.total_pages;
    totalItems.value = response.total;
  } catch (err: any) {
    if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
      console.error('Tutor search error:', err);
    }
  } finally {
    searchLoading.value = false;
  }
};

const debouncedSearch = createDebouncedSearch(searchFunction, 300);

const handleSearch = async () => {
  const query = searchQuery.value?.trim() || '';
  if (query.length > 0) {
    await debouncedSearch(query);
  } else {
    await searchFunction('');
  }
};

onMounted(async () => {
  await searchFunction('');
});
</script>

<template>
  <ComponentTitle :config="pageConfig.pageHeaderConfig" />
  <!-- Search and Filter Section -->
  <v-row class="mb-4">
    <v-col cols="12" md="5" class="order-2 order-md-1">
      <v-text-field v-model="searchQuery" placeholder="Search tutors..." variant="outlined" clearable hide-details
        @update:model-value="handleSearch" @keyup.enter="handleSearch">
        <template v-slot:prepend-inner>
          <div class="text-lightText d-flex align-center">
            <SvgSprite name="custom-search" style="width: 16px; height: 16px" />
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="12" md="7" class="justify-end d-flex order-1 order-md-2">
      <slot name="tableController">
        <v-btn color="primary" size="small" :icon="mdiTuneVariant" rounded="sm" variant="tonal" title="Filter" />
        <v-btn class="mx-2" color="primary" size="small" rounded="sm" variant="tonal" :icon="mdiTrayArrowDown"
          title="Download" />
      </slot>
    </v-col>
  </v-row>
  <!-- Search and Filter Section Ends -->

  <!-- Button Group Section -->
  <div class="text-left">
    <DtListTabbedUI v-model="activeTab">
      <!-- Table Section -->
      <template #table>
        <DataTable :headers="pageConfig.dataTableConfig.headers" :items="tutorList" :total-items="totalItems"
          :loading="searchLoading" :items-per-page="itemsPerPage" :search="searchQuery" item-value="user_table_id"
          search-placeholder="Search tutors..." no-data-message="No tutors found. Try adjusting your search criteria.">
          <template #item.class_name="{ item }">
            <div>
              <span class="text-body-2 font-weight-medium">
                {{ item.class_name }} - {{ item.board_name?.toUpperCase() || '' }}
              </span>
            </div>
          </template>
          <!-- Action Buttons -->
          <template #item.DT_BTNS="{ item }">
            <div>
              <v-btn size="small" color="primary" variant="tonal" :icon="mdiPhone" title="Call"
                @click="CommonHelpers.launchDialpad(item.mobile)" />
              <RouterLink class="ml-2" :to="{ name: 'BrowseTutorsProfile', params: { id: encrypt(item.id) } }"
                style="text-decoration: none; display: inline-block">
                <v-btn size="small" color="primary" variant="tonal" :icon="mdiArrowRight" title="View Tutor Profile" />
              </RouterLink>
            </div>
          </template>
          <!-- Action Buttons Ends -->
        </DataTable>
      </template>

      <!-- List Section -->
      <template #list>
        <div v-for="data in tutorList" :key="data.user_table_id">
          <ProfileList :config="pageConfig.profileListConfig" :data="data">
            <template #actionBtn="{ item }">
              <div class="mb-3 text-right">
                <v-btn width="x-small" color="primary" variant="outlined"
                  :to="{ name: 'BrowseTutorsProfile', params: { id: encrypt(item.id) } }">
                  Visit Tutor
                </v-btn>
              </div>
            </template>
          </ProfileList>
        </div>
      </template>

      <!-- Card Section -->
      <template #card>
        <v-row no-gutters>
          <v-col cols="12" md="4" class="pa-1" v-for="data in tutorList" :key="data.user_table_id">
            <ProfileCard :config="pageConfig.profileCardConfig" :data="data">
              <template #classAndBoard="{ item }">
                <div>
                  <div class="text-caption text-medium-emphasis mb-1">Subjects & board</div>
                  <div class="text-subtitle-2 text-truncate">
                    {{ item.class_name }} - {{ item.board_name?.toUpperCase() }}
                  </div>
                </div>
              </template>

              <template #actionBtn="{ item }">
                <div class="mb-3 d-flex justify-space-between">
                  <v-btn color="primary" variant="outlined" width="48%"
                    @click="CommonHelpers.launchDialpad(item.mobile)">
                    Call
                  </v-btn>
                  <v-btn color="primary" variant="outlined" width="48%"
                    :to="{ name: 'BrowseTutorsProfile', params: { id: encrypt(item.id) } }">
                    Visit Tutor
                  </v-btn>
                </div>
              </template>
            </ProfileCard>
          </v-col>
        </v-row>
      </template>
      <!-- Button Group Section Ends -->
    </DtListTabbedUI>
  </div>

  <!-- Pagination Section (hidden for graph tab) -->
  <v-row class="my-4 px-1" v-if="activeTab !== 'graph'">
    <v-col cols="12" md="6" class="text-caption text-secondary">
      Showing
      <span class="font-weight-bold px-1">
        {{ Math.min((page - 1) * itemsPerPage + 1, totalItems) }} -
        {{ Math.min(page * itemsPerPage, totalItems) }}
      </span>
      of
      <span class="font-weight-bold px-1">
        {{ totalItems }}
      </span>
    </v-col>
    <v-col cols="12" md="6" class="justify-center justify-md-end d-flex">
      <v-pagination class="dt_table_pagination" active-color="primary" color="secondary" variant="text" size="small"
        rounded v-model="page" :length="totalPages" :total-visible="7"
        @update:model-value="searchFunction(searchQuery)" />
    </v-col>
  </v-row>
</template>
