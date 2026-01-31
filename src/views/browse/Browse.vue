<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createDebouncedSearch, api } from '@/utils/api/axios';
import CommonHelpers from '@/utils/helpers/helper-functions';
import { mdiTuneVariant, mdiTrayArrowDown, mdiClockTimeTwo, mdiCheckDecagram, mdiTranslate, mdiAccountSchool, mdiMapMarker, mdiHeart, mdiHeartOutline, mdiShareVariant } from '@mdi/js';

const mobileScreen = CommonHelpers.isMobile();

import ComponentTitle from '@/components/shared/ComponentTitle.vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import pageConfig from './config/tutor_list';
import female from '@/assets/images/gender/female.png';

const studentList = ref<any[]>([]);
const page = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(20);
const searchQuery = ref('');
const searchLoading = ref(false);

const searchFunction = async (query: string, signal?: AbortSignal) => {
  searchLoading.value = true;
  try {
    const response = await api.get<any>(pageConfig.API_URL, {
      params: { q: query, page: page.value },
      signal
    });
    studentList.value = response.students;
    totalPages.value = response.total_pages;
    totalItems.value = response.total;
  } catch (err: any) {
    if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
      console.error('Search error:', err);
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
  searchFunction('');
});
</script>

<template>
  <ComponentTitle :config="pageConfig.pageHeaderConfig" />
  <!-- Search and Filter Section -->
  <v-row class="mb-4">
    <v-col cols="12" md="5" class="order-2 order-md-1">
      <v-text-field v-model="searchQuery" :placeholder="pageConfig.SEARCH_LABEL" variant="outlined" clearable
        hide-details @update:model-value="handleSearch" @keyup.enter="handleSearch">
        <template v-slot:prepend-inner>
          <div class="text-lightText d-flex align-center">
            <SvgSprite name="custom-search" style="width: 16px; height: 16px" />
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="12" md="7" class="justify-end d-flex order-1 order-md-2">
      <slot name="tableController">
        <v-btn class="" color="primary" size="small" :icon="mdiTuneVariant" rounded="sm" variant="tonal" title="Filter">
        </v-btn>
        <v-btn class="mx-2" color="primary" size="small" rounded="sm" variant="tonal" :icon="mdiTrayArrowDown"
          title="Download"> </v-btn>
      </slot>
    </v-col>
  </v-row>
  <!-- Search and Filter Section Ends -->
  <!-- Button Group Section -->
  <div class="text-left">
    <!-- Card Section -->
    <v-row no-gutters>
      <v-col cols="12" md="4" class="pa-1" v-for="data in studentList" :key="data.user_table_id">
        <v-card rounded="md" class="mb-4 v-card--variant-outlined" variant="flat" color="white">
          <!-- Profile Header -->
          <v-sheet color="primary" class="pa-4 text-center rounded-md position-relative overflow-hidden"
            style="border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important">
            <!-- Background Decorative Elements - Choose one style below -->
            <!-- Style Option 1: Waves Pattern -->
            <div class="bg-decoration">
              <svg class="wave-pattern" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  fill="rgba(255,255,255,0.1)"></path>
              </svg>
            </div>
            <div class="position-relative mb-3" style="z-index: 1">
              <div>
                <v-progress-circular model-value="100" :rotate="-90" :size="mobileScreen ? 100 : 100" :width="3"
                  color=" white">
                  <v-avatar :size="mobileScreen ? 86 : 98" class="border-lg bg-white">
                    <v-img :src="female" :alt="'female'" cover />
                  </v-avatar>
                </v-progress-circular>
              </div>

              <!-- <v-chip color="success" size="x-small" variant="flat" class="completion-badge">
                100%
              </v-chip> -->
            </div>

            <div style="position: relative; z-index: 1" class="text-center">
              <div class="d-flex align-center justify-center">
                <h3 class="text-h5 font-weight-bold text-white text-truncate">
                  {{ data.name || '' }}
                </h3>
                <v-icon class="ml-1 text-success" :icon="mdiCheckDecagram" size="20" />
              </div>
              <!-- <v-chip size="small" variant="tonal" color="white" class="my-3">
                <v-icon size="18" class="mr-1" :icon="mdiAccountSchool"></v-icon><b>Maths, Science Biology</b>
              </v-chip> -->
              <v-chip size="small" variant="tonal" rounded="md" color="white" class="my-3">
                <v-icon size="18" class="mr-1" :icon="mdiMapMarker"></v-icon><b>Raipur, Chhattisgarh, India</b>
              </v-chip>
              <div class="text-body-2 text-truncate">
                <!-- Raipur, Chhattisgarh, India -->
                Maths| Science | Biology
              </div>
            </div>

          </v-sheet>

          <!-- reviews rating section -->
          <v-row no-gutters class="bg-secondary100">
            <v-col cols="4" md="4" class="pa-3 justify-center text-center">
              <div class="d-flex align-center justify-center">
                <span class="mr-2 font-weight-bold  text-subtitle-1"> 4.5 </span>
                <SvgSprite name="custom-star" style="width: 18px; height: 18px" class="" />
              </div>
              <div class="text-caption text-medium-emphasis ">
                14k Reviews
              </div>
            </v-col>
            <v-col cols="4" md="4" class="pa-3 justify-center text-center">
              <div class="d-flex align-center justify-center">
                <span class="mr-2 font-weight-bold  text-subtitle-1"> 100 </span>
                <v-icon size="18" class="mr-1" :icon="mdiClockTimeTwo"></v-icon>
              </div>
              <div class="text-caption text-medium-emphasis ">
                Hrs Classes
              </div>
            </v-col>
            <v-col cols="4" md="4" class="pa-3 justify-center text-center">
              <div class="d-flex align-center justify-center">
                <span class="mr-2 font-weight-bold  text-subtitle-1"> 45 </span>
                <SvgSprite name="custom-user-1  " style="width: 18px; height: 18px" class="" />
              </div>
              <div class="text-caption text-medium-emphasis ">
                Students
              </div>
            </v-col>
          </v-row>
          <!--  -->

          <v-card-text class="py-2">
            <div class="d-flex align-center ">
              <v-icon size="small" color="" class="mr-1" :icon="mdiTranslate"></v-icon>
              <div class="text-body-2 text-truncate">
                Hindi(Native), English(Fluent), Tamil(Fluent)
              </div>
            </div>
            <div class="text-body-2 text-medium-emphasis font-weight-medium text-truncate-3 my-3">Math Tutor |9 years of
              experience |
              Engineer | GCSE(edxcel,AQA) | IGCSE | Calculus | Algebra | AP Calculus | Trigonometry | Keystage|
              O/A-levels
              Engineer | GCSE(edxcel,AQA) | IGCSE | Calculus | Algebra | AP Calculus | Trigonometry | Keystage|
              O/A-levels
            </div>
            <v-row no-gutters class="mb-3 align-center">
              <v-col cols="7" md="6" class="align-center">
                <h6 class="text-h3">₹<span class="font-poppins">1000</span>
                  <span class="text-caption text-medium-emphasis"> /hour</span>
                </h6>
              </v-col>
              <v-col cols="5" md="6" class=" text-right">
                <v-btn class="mr-2" color="primary" variant="tonal" size="x-small" icon>
                  <!-- <v-icon :icon="mdiHeart"></v-icon> -->
                  <v-icon :icon="mdiHeartOutline"></v-icon>

                </v-btn>
                <v-btn color="primary" variant="tonal" size="x-small" :icon="mdiShareVariant"></v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="">
            <v-btn color="primary" variant="outlined" block>Know More</v-btn>
          </v-card-actions>
        </v-card>
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
      <v-pagination class="dt_table_pagination" active-color="primary" color="secondary" variant="text" size="small"
        rounded v-model="page" :length="totalPages" :total-visible="7"
        @update:model-value="searchFunction(searchQuery)"></v-pagination></v-col>
  </v-row>
</template>

<style scoped lang="scss">
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.wave-pattern {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}
</style>
