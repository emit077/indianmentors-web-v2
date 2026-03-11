<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createDebouncedSearch, api } from '@/utils/api/axios';
import { mdiTrayArrowDown, mdiTuneVariant, mdiArrowRight, mdiCalendarClock } from '@mdi/js';

import URLS from '@/utils/urls';
import ProfileCard from '@/components/shared/ProfileCard.vue';
import ProfileList from '@/components/shared/ProfileList.vue';
import DataTable from '@/components/datatable/DataTable.vue';
import DtListTabbedUI from '@/components/datatable/DtListTabbedUI.vue';
import ComponentTitle from '@/components/shared/ComponentTitle.vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import pageConfig from './config/scheduled_payment_list';

const scheduledList = ref<any[]>([]);
const page = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(20);
const searchQuery = ref('');
const searchLoading = ref(false);
const activeTab = ref<string>('table');

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const getStatusColor = (status: string) => {
  const m: Record<string, string> = {
    Upcoming: 'info',
    Due: 'warning',
    Paid: 'success',
    Overdue: 'error',
    Cancelled: 'default'
  };
  return m[status] ?? 'default';
};

const transformForDisplay = (items: any[]) =>
  items.map((item) => ({
    ...item,
    student_id: item.plan_id,
    signup_date: item.due_date,
    amount: typeof item.amount === 'number' ? formatAmount(item.amount) : item.amount
  }));

const searchFunction = async (query: string, signal?: AbortSignal) => {
  searchLoading.value = true;
  try {
    const response = await api.get<any>(URLS.PAYMENT_SCHEDULED_LIST, {
      params: { q: query, page: page.value },
      signal
    });
    const items = response.scheduled_payments ?? response.data ?? [];
    scheduledList.value = transformForDisplay(items);
    totalPages.value = response.total_pages ?? 1;
    totalItems.value = response.total ?? items.length;
  } catch (err: any) {
    if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
      scheduledList.value = transformForDisplay(getMockScheduled());
      totalPages.value = 1;
      totalItems.value = scheduledList.value.length;
    }
  } finally {
    searchLoading.value = false;
  }
};

const getMockScheduled = () => [
  {
    id: 1,
    plan_id: 'PLAN-2025-001',
    user: { name: 'Rahul Sharma', gender: 'Male', profile_completion_per: 85 },
    amount: 2500,
    due_date: '28 Feb 2025',
    installment: '2 of 6',
    status: 'Upcoming'
  },
  {
    id: 2,
    plan_id: 'PLAN-2025-002',
    user: { name: 'Priya Patel', gender: 'Female', profile_completion_per: 90 },
    amount: 5000,
    due_date: '15 Mar 2025',
    installment: '1 of 3',
    status: 'Due'
  },
  {
    id: 3,
    plan_id: 'PLAN-2025-003',
    user: { name: 'Amit Kumar', gender: 'Male', profile_completion_per: 70 },
    amount: 3500,
    due_date: '10 Feb 2025',
    installment: '3 of 6',
    status: 'Paid'
  }
];

const debouncedSearch = createDebouncedSearch(searchFunction, 300);
const handleSearch = async () => {
  const q = searchQuery.value?.trim() || '';
  if (q.length > 0) await debouncedSearch(q);
  else await searchFunction('');
};

onMounted(() => searchFunction(''));
</script>

<template>
  <ComponentTitle :config="pageConfig.pageHeaderConfig" />
  <v-row class="mb-4">
    <v-col cols="12" md="5" class="order-2 order-md-1">
      <v-text-field v-model="searchQuery" placeholder="Search by plan ID or name..." variant="outlined" clearable
        hide-details @update:model-value="handleSearch" @keyup.enter="handleSearch">
        <template v-slot:prepend-inner>
          <div class="text-lightText d-flex align-center">
            <SvgSprite name="custom-search" style="width: 16px; height: 16px" />
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="12" md="7" class="justify-end d-flex order-1 order-md-2">
      <v-btn color="primary" size="small" :icon="mdiTuneVariant" rounded="sm" variant="tonal" title="Filter" />
      <v-btn class="mx-2" color="primary" size="small" rounded="sm" variant="tonal" :icon="mdiTrayArrowDown"
        title="Download" />
    </v-col>
  </v-row>
  <div class="text-left">
    <DtListTabbedUI v-model="activeTab">
      <template #table>
        <DataTable :headers="pageConfig.dataTableConfig.headers" :items="scheduledList" :total-items="totalItems"
          :loading="searchLoading" :items-per-page="itemsPerPage" :search="searchQuery" item-value="id"
          search-placeholder="Search scheduled payments..." no-data-message="No scheduled payments found.">
          <template #item.amount="{ item }">
            <span class="font-weight-medium text-success">{{ item.amount }}</span>
          </template>
          <template #item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal">{{ item.status }}</v-chip>
          </template>
          <template #item.DT_BTNS="{ item }">
            <v-btn size="small" color="primary" variant="tonal" :icon="mdiCalendarClock" title="View Schedule" />
            <v-btn size="small" color="primary" variant="tonal" :icon="mdiArrowRight" class="ml-2"
              title="View Details" />
          </template>
        </DataTable>
      </template>
      <template #list>
        <div v-for="data in scheduledList" :key="data.id ?? data.plan_id">
          <ProfileList :config="pageConfig.profileListConfig" :data="data">
            <template #actionBtn>
              <div class="mb-3 text-right">
                <v-btn size="x-small" color="primary" variant="outlined">View Details</v-btn>
              </div>
            </template>
          </ProfileList>
        </div>
      </template>
      <template #card>
        <v-row no-gutters>
          <v-col cols="12" md="4" class="pa-1" v-for="data in scheduledList" :key="data.id ?? data.plan_id">
            <ProfileCard :config="pageConfig.profileCardConfig" :data="data">
              <template #actionBtn="{ item }">
                <div class="mb-3 d-flex justify-space-between">
                  <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal">{{ item.status }}</v-chip>
                  <v-btn color="primary" variant="outlined" size="small">View Details</v-btn>
                </div>
              </template>
            </ProfileCard>
          </v-col>
        </v-row>
      </template>
    </DtListTabbedUI>
  </div>
  <v-row class="my-4 px-1" v-if="activeTab !== 'graph'">
    <v-col cols="12" md="6" class="text-caption text-secondary">
      Showing
      <span class="font-weight-bold px-1">{{ Math.min((page - 1) * itemsPerPage + 1, totalItems) }} - {{ Math.min(page *
        itemsPerPage, totalItems) }}</span>
      of <span class="font-weight-bold px-1">{{ totalItems }}</span>
    </v-col>
    <v-col cols="12" md="6" class="justify-center justify-md-end d-flex">
      <v-pagination class="dt_table_pagination" active-color="primary" color="secondary" variant="text" size="small"
        rounded v-model="page" :length="totalPages" :total-visible="7"
        @update:model-value="searchFunction(searchQuery)" />
    </v-col>
  </v-row>
</template>
