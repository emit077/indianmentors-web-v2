<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/utils/api/axios';
import URLS from '@/utils/urls';
import { decrypt } from '@/utils/helpers/crypto';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ConfigField from '@/components/shared/ConfigField.vue';
import studentProfileConfig from './config/student_profile';
import BasicDetailsDialog from './components/BasicDetailsDialog.vue';
import AcademicDetailsDialog from './components/AcademicDetailsDialog.vue';
import AddressDetailsDialog from './components/AddressDetailsDialog.vue';
import TutoringPreferencesDialog from './components/TutoringPreferencesDialog.vue';
import TutorPreferencesDialog from './components/TutorPreferencesDialog.vue';
import ParentDetailsDialog from './components/ParentDetailsDialog.vue';
import ReferralDialog from './components/ReferralDialog.vue';
import AdditionalDetailsDialog from './components/AdditionalDetailsDialog.vue';
import getFeatherIcon from '@/utils/feather-icons';
import male from '@/assets/images/gender/male.png';
import female from '@/assets/images/gender/female.png';
// Get student ID from route params
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const error = ref<string | null>(null);
const studentId = computed(() => decrypt(String(route.params.id)));

// Student profile data - stored in reactive state (using API response structure)
const studentData = ref<any>({});
const profileTab = ref<string>('basic_details');

// Dialog states
const basicDetailsDialog = ref(false);
const academicDetailsDialog = ref(false);
const addressDetailsDialog = ref(false);
const tutoringPreferencesDialog = ref(false);
const tutorPreferencesDialog = ref(false);
const parentDetailsDialog = ref(false);
const referralDialog = ref(false);
const additionalDetailsDialog = ref(false);

// Computed properties for display
const fullName = computed(() => {
  if (studentData.value.name) {
    return studentData.value.name;
  }
  if (studentData.value.first_name || studentData.value.last_name) {
    return `${studentData.value.first_name || ''} ${studentData.value.last_name || ''}`.trim();
  }
  return 'Not provided';
});

const profilePictureUrl = computed(() => {
  if (studentData.value.profile_picture || studentData.value.profilePicture) {
    const picture = studentData.value.profile_picture || studentData.value.profilePicture;
    return typeof picture === 'string' ? picture : URL.createObjectURL(picture);
  }
  return null;
});

// Fetch student profile from API
const fetchStudentProfile = async () => {
  if (!studentId.value) {
    error.value = 'Student ID is required';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await api.get<any>(URLS.STUDENT_PROFILE, { params: { student_table_id: studentId.value } });

    // Use the API response directly - same variable names from API
    if (response) {
      studentData.value = response;
    }
  } catch (err: any) {
    console.error('Error fetching student profile:', err);
    error.value = err.message || 'Failed to load student profile';

    // Redirect to student list if student not found
    if (err.response?.status === 404) {
      setTimeout(() => {
        router.push({ name: 'StudentList' });
      }, 2000);
    }
  } finally {
    loading.value = false;
  }
};

// Load data from API on mount
onMounted(() => {
  if (studentId.value) {
    fetchStudentProfile();
  } else {
    error.value = 'Student ID is required';
  }
});

// Save section data
const saveSectionData = (section: string, data: any) => {
  studentData.value = { ...studentData.value, ...data };
  localStorage.setItem('studentProfileData', JSON.stringify(studentData.value));
};

// Dialog mapping
const dialogMap: Record<string, any> = {
  BasicDetailsDialog: basicDetailsDialog,
  AcademicDetailsDialog: academicDetailsDialog,
  AddressDetailsDialog: addressDetailsDialog,
  TutoringPreferencesDialog: tutoringPreferencesDialog,
  TutorPreferencesDialog: tutorPreferencesDialog,
  ParentDetailsDialog: parentDetailsDialog,
  ReferralDialog: referralDialog,
  AdditionalDetailsDialog: additionalDetailsDialog
};

const openDialog = (sectionKey: string) => {
  const section = studentProfileConfig.find((s) => s.sectionKey === sectionKey);
  if (section?.dialogComponent && dialogMap[section.dialogComponent]) {
    dialogMap[section.dialogComponent].value = true;
  }
};

const onDownloadPDF = () => {
  // Generate and download PDF
  alert('PDF download functionality would be implemented here');
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <div class="d-flex justify-space-between align-center mb-6 px-5">
        <h1 class="text-h4">Student Profile</h1>
        <v-btn color="primary" prepend-icon="mdi-download" @click="onDownloadPDF"> Download Profile (PDF) </v-btn>
      </div>
    </v-col>
  </v-row>
  <v-container fluid>
    <!-- Dynamic Sections based on Config -->
    <v-row>
      <v-col cols="3" md="3" sm="12">
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-item class="pa-5 text-center">
            <v-progress-circular
              :model-value="studentData.profile_completion_per"
              :rotate="195"
              :size="150"
              :width="10"
              color="success"
              bg-color="#E9F0FF"
            >
              <v-avatar :size="130" color="#fff" variant="tonal" class="elevation-5">
                <v-img v-if="studentData.gender === 'Male'" :src="male" :alt="studentData.gender" :size="90" class="mt-1" />
                <v-img v-else="studentData.gender === 'Female'" :src="female" :alt="studentData.gender" :size="90" class="mt-5" />
                <!-- <span v-else class="text-body-1 font-weight-bold"> -- </span> -->
              </v-avatar>
            </v-progress-circular>
            <div>
              <v-chip color="secondary" size="small" variant="flat" class="mt-1 text-center font-weight-bold">
                {{ studentData.profile_completion_per?.toFixed(0) }} %
              </v-chip>
            </div>
            <h3 class="text-center mt-3">{{ studentData.name }}</h3>
            <p class="text-center text-subtitle-1 font-weight-medium my-2">#{{ studentData.student_id }}</p>
            <v-divider></v-divider>

            <div class="d-sm-flex align-center justify-space-between">
              <v-card-title class="text-subtitle-1 justify-center" style="line-height: 1.57"></v-card-title>
              <slot name="action"></slot>
            </div>
          </v-card-item>
          <v-card-text>
            <v-tabs v-model="profileTab" color="primary" direction="vertical">
              <v-tab
                v-for="section in studentProfileConfig"
                :key="section.sectionKey"
                :text="section.title"
                :value="section.sectionKey"
              ></v-tab>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8" md="8" sm="12" xs="12">
        <v-tabs-window v-model="profileTab">
          <v-tabs-window-item v-for="section in studentProfileConfig" :key="section.sectionKey" :value="section.sectionKey">
            <UiParentCard :title="section.title">
              <template #action>
                <v-btn
                  v-if="section.dialogComponent"
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  @click="openDialog(section.sectionKey)"
                />
              </template>
              <v-row>
                <ConfigField v-for="field in section.fields" :key="field.data" :config="field" :data="studentData"> </ConfigField>
              </v-row>
              <v-divider class="my-4" />
              <div v-if="section.dialogComponent" class="d-flex justify-end">
                <v-btn color="primary" @click="openDialog(section.sectionKey)">
                  <i class="profile--btn pa-1 text-subtitle-1" v-html="getFeatherIcon('edit-2')"></i>
                  Edit</v-btn
                >
              </div>
            </UiParentCard>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
      <!-- <v-col cols="9">
        <UiParentCard :title="section.title">
          <template #action>
            <v-btn v-if="section.dialogComponent" icon="mdi-pencil" variant="text" size="small" @click="openDialog(section.sectionKey)" />
          </template>
          <v-row>
            <ConfigField v-for="field in section.fields" :key="field.data" :config="field" :data="studentData"> </ConfigField>
          </v-row>
          <v-divider class="my-4" />
          <div v-if="section.dialogComponent" class="d-flex justify-end">
            <v-btn color="primary" @click="openDialog(section.sectionKey)">
              <i class="profile--btn pa-1 text-subtitle-1" v-html="getFeatherIcon('edit-2')"></i>
              Edit</v-btn
            >
          </div>
        </UiParentCard>
      </v-col> -->
    </v-row>

    <!-- Action Buttons -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex gap-3 justify-end">
          <v-btn variant="outlined" color="info" prepend-icon="mdi-account-plus"> Link Another Child </v-btn>
          <v-btn variant="outlined" color="success" prepend-icon="mdi-check" size="large"> Submit Registration </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <BasicDetailsDialog v-model="basicDetailsDialog" :data="studentData" @save="saveSectionData('basic', $event)" />
    <AcademicDetailsDialog v-model="academicDetailsDialog" :data="studentData" @save="saveSectionData('academic', $event)" />
    <AddressDetailsDialog v-model="addressDetailsDialog" :data="studentData" @save="saveSectionData('address', $event)" />
    <TutoringPreferencesDialog v-model="tutoringPreferencesDialog" :data="studentData" @save="saveSectionData('tutoring', $event)" />
    <TutorPreferencesDialog v-model="tutorPreferencesDialog" :data="studentData" @save="saveSectionData('tutorPrefs', $event)" />
    <ParentDetailsDialog v-model="parentDetailsDialog" :data="studentData" @save="saveSectionData('parent', $event)" />
    <ReferralDialog v-model="referralDialog" :data="studentData" @save="saveSectionData('referral', $event)" />
    <AdditionalDetailsDialog v-model="additionalDetailsDialog" :data="studentData" @save="saveSectionData('additional', $event)" />
  </v-container>
</template>

<style scoped>
.gap-3 {
  gap: 12px;
}

.profile--btn {
  height: 24px;
  width: 24px;
  border-radius: 8px;
  margin: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: rgb(var(--btn-color), 0.2);
  .feather {
    height: 12px !important;
    width: 12px !important;
    color: rgb(var(--btn-color), 1);
  }
}
</style>
