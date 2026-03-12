<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/utils/api/axios';
import URLS from '@/utils/urls';
import { decrypt } from '@/utils/helpers/crypto';
import ConfigField from '@/components/shared/ConfigField.vue';
import BasicDetailsDialog from './components/BasicDetailsDialog.vue';
import AcademicDetailsDialog from './components/AcademicDetailsDialog.vue';
import AddressDetailsDialog from './components/AddressDetailsDialog.vue';
import TutoringPreferencesDialog from './components/TutoringPreferencesDialog.vue';
import TutorPreferencesDialog from './components/TutorPreferencesDialog.vue';
import ParentDetailsDialog from './components/ParentDetailsDialog.vue';
import ReferralDialog from './components/ReferralDialog.vue';
import AdditionalDetailsDialog from './components/AdditionalDetailsDialog.vue';
import male from '@/assets/images/gender/male.png';
import female from '@/assets/images/gender/female.png';
import CommonHelpers from '@/utils/helpers/helper-functions';
import ComponentTitle from '@/components/shared/ComponentTitle.vue';
import pageConfig from './config/profile';
import {
    mdiChevronRight,
    mdiPencil,
    mdiPhoneOutline,
    mdiEmailOutline,
    mdiAccountSchool,
    mdiMapMarkerOutline,
    mdiClockOutline,
    mdiViewList,
    mdiMapMarker,
    mdiMessageText,
    mdiTranslate,
    mdiSchoolOutline
} from '@mdi/js';

const mobileScreen = CommonHelpers.isMobile();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const error = ref<string | null>(null);
const studentId = computed(() => decrypt(String(route.params.id)));

const studentData = ref<any>({});

// Dialog states
const basicDetailsDialog = ref(false);
const academicDetailsDialog = ref(false);
const addressDetailsDialog = ref(false);
const tutoringPreferencesDialog = ref(false);
const tutorPreferencesDialog = ref(false);
const parentDetailsDialog = ref(false);
const referralDialog = ref(false);
const additionalDetailsDialog = ref(false);

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
        if (response) {
            studentData.value = response;
        }
    } catch (err: any) {
        console.error('Error fetching student profile:', err);
        error.value = err.message || 'Failed to load student profile';

        if (err.response?.status === 404) {
            setTimeout(() => {
                router.push({ name: 'StudentList' });
            }, 2000);
        }
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    if (studentId.value) {
        fetchStudentProfile();
    } else {
        error.value = 'Student ID is required';
    }
});

const saveSectionData = (section: string, data: any) => {
    studentData.value = { ...studentData.value, ...data };
    localStorage.setItem('studentProfileData', JSON.stringify(studentData.value));
};

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
    const section = pageConfig.studentProfileConfig.find((s: any) => s.sectionKey === sectionKey);
    if (section?.dialogComponent && dialogMap[section.dialogComponent]) {
        dialogMap[section.dialogComponent].value = true;
    }
};

const scrollToSection = (sectionKey: string) => {
    const element = document.getElementById(sectionKey);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};
</script>

<template>
    <ComponentTitle :config="pageConfig.pageHeaderConfig" />

    <!-- Loading State -->
    <v-row v-if="loading">
        <v-col cols="12" md="3">
            <v-skeleton-loader type="card-avatar, article" elevation="0"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="9">
            <v-skeleton-loader type="article, article" class="mb-4" elevation="0"></v-skeleton-loader>
        </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error" class="justify-center">
        <v-col cols="12" md="8">
            <v-card rounded="md" variant="flat" color="white" class="pa-8 text-center">
                <v-icon size="80" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
                <h2 class="text-h5 mb-3">Oops! Something went wrong</h2>
                <p class="text-body-1 text-medium-emphasis mb-6">{{ error }}</p>
                <v-btn color="primary" size="large" rounded="md" @click="router.push({ name: 'StudentList' })">
                    <v-icon start>mdi-arrow-left</v-icon>
                    Back to Student List
                </v-btn>
            </v-card>
        </v-col>
    </v-row>

    <!-- Main Content -->
    <v-row v-else>
        <!-- Sidebar Profile Card -->
        <v-col cols="12" md="3" class="mb-4">
            <v-card rounded="md" class="mb-4 v-card--variant-outlined profile-sidebar" variant="flat" color="white">
                <!-- Profile Header -->
                <v-sheet color="primary" class="pa-6 text-center rounded-md position-relative overflow-hidden"
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

                    <div class="position-relative d-inline-block mb-4" style="z-index: 1">
                        <v-progress-circular :model-value="studentData.profile_completion_per || 0" :rotate="-90"
                            :size="mobileScreen ? 110 : 130" :width="6" color="white">
                            <v-avatar :size="mobileScreen ? 96 : 114" class="">
                                <v-img v-if="studentData.gender === 'Male'" :src="male" :alt="studentData.gender"
                                    cover />
                                <v-img v-else-if="studentData.gender === 'Female'" :src="female"
                                    :alt="studentData.gender" cover />
                                <v-icon v-else :size="mobileScreen ? 50 : 60">mdi-account</v-icon>
                            </v-avatar>
                        </v-progress-circular>
                    </div>

                    <div style="position: relative; z-index: 1">
                        <h3 class="text-h5 font-weight-bold mb-2 text-white">{{ studentData.name || '' }}</h3>
                        <!-- <v-chip size="small" variant="tonal" color="white" class="mb-2"> #{{ studentData.student_id || 'N/A' }}</v-chip> -->
                        <div class="d-flex align-center justify-center mt-2 ">
                            <v-icon size="x-small" color="white" class="mr-1" :icon="mdiClockOutline"></v-icon>
                            <span class="text-caption text-white">Last Active: Just Now</span>
                        </div>
                        <v-divider class="my-3"></v-divider>
                        <div class="text-body-2 text-center text-truncate">
                            <v-icon size="18" class="mr-1" :icon="mdiMapMarker"></v-icon><b>Raipur, Chhattisgarh,
                                India</b>
                        </div>
                    </div>
                </v-sheet>

                <!-- Contact Info -->
                <v-card-text class="pa-0">
                    <!-- reviews rating section -->
                    <v-row no-gutters class="bg-secondary100">
                        <v-col cols="6" md="6" class="py-3 px-0 justify-center text-center">
                            <div class="d-flex align-center justify-center">
                                <span class="mr-2 font-weight-bold  text-subtitle-1"> 4.5 </span>
                                <SvgSprite name="custom-star" style="width: 18px; height: 18px" class="" />
                            </div>
                            <div class="text-caption text-medium-emphasis ">
                                14k Reviews
                            </div>
                        </v-col>
                        <v-col cols="6" md="6" class="pa-3 justify-center text-center">
                            <div class="d-flex align-center justify-center">
                                <span class="mr-2 font-weight-bold  text-subtitle-1"> 45 </span>
                                <SvgSprite name="custom-user-1  " style="width: 18px; height: 18px" class="" />
                            </div>
                            <div class="text-caption text-medium-emphasis ">
                                Students
                            </div>
                        </v-col>
                    </v-row>
                    <!-- rate section -->
                    <div class="text-center pt-5 pb-2">
                        <h6 class="text-h3">₹<span class="font-poppins">1000</span></h6>
                        <span class="text-caption text-medium-emphasis"> For 60 min Lession </span>
                    </div>
                    <!-- action btn -->
                    <div class="pa-4">
                        <v-btn class="mb-3" variant="outlined" color="primary" block>
                            <v-icon class="mr-2" size="20" :icon="mdiMessageText"></v-icon> Message
                        </v-btn>
                        <v-btn color="primary" variant="flat" block>
                            <v-icon class="mr-2" size="20" :icon="mdiPhoneOutline"></v-icon> Call
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
        <!-- Main Content -->
        <v-col cols="12" md="9">
            <v-card class="mb-4 v-card--variant-outlined" variant="flat" color="white">
                <v-card-text class="pa-4 pa-md-6">
                    <!-- subject and language -->
                    <div class="pb-3">
                        <div class="d-flex align-center ">
                            <v-icon class="mr-2" :icon="mdiSchoolOutline"></v-icon>
                            <div class="text-truncate">
                                Mathematics | English
                            </div>
                        </div>
                        <div class="d-flex align-center mt-3">
                            <v-icon class="mr-2" :icon="mdiTranslate"></v-icon>
                            <div class="text-truncate">
                                Hindi(Native), English(Fluent), Tamil(Fluent)
                            </div>
                        </div>
                    </div>
                    <!-- About -->
                    <div class="py-3">
                        <h3 class="text-h4 mb-5">About Bhamini Grover </h3>
                        <div class="my-5">
                            Hi! I’m Bhamini Grover. I am a dual-degree professional with an M.Tech from IIIT Allahabad
                            and an MBA from
                            Symbiosis. With nearly 20 years of combined experience across the technology industry and
                            academia, I
                            provide elite-level coaching in Advanced Calculus, Statistics, and Quantitative Logic across
                            all major
                            international curricula.
                        </div>
                    </div>
                    <!-- Education -->
                    <div class="py-3">
                        <h3 class="text-h4 mb-5">Education</h3>
                        <div class="d-flex ">
                            <div><span class="text-caption">2025-2026</span></div>
                            <div class="pl-4">
                                <b>M. Tech</b>
                                <p>Indian Institute of Information Technology</p>
                            </div>
                        </div>
                        <div class="my-3 d-flex ">
                            <div><span class="text-caption">2021-2025</span></div>
                            <div class="pl-4">
                                <b>B. Tech</b>
                                <p>Indian Institute of Information Technology</p>
                            </div>
                        </div>
                        <!-- <div class="my-3">
              <b>M. Tech</b>, <span class="text-caption">2025-2026</span>
              <p>Indian Institute of Information Technology</p>
            </div>
            <div class="my-3">
              <b>B. Tech</b>, <span class="text-caption">2021-2025</span>
              <p>Indian Institute of Information Technology</p>
            </div> -->
                    </div>
                    <!-- Experience -->
                    <div class="py-3">
                        <h3 class="text-h4 mb-5">Experience</h3>
                        <div class=" d-flex ">
                            <div><span class="text-caption">2025-2026</span></div>
                            <div class="pl-4">
                                <b>Sr. Assistant Professor </b>
                                <p>Indian Institute of Information Technology</p>
                            </div>
                        </div>
                        <div class="my-3 d-flex ">
                            <div><span class="text-caption">2021-2025</span></div>
                            <div class="pl-4">
                                <b>Assistant Professor</b>
                                <p>Indian Institute of Information Technology</p>
                            </div>
                        </div>
                        <!-- <div class="my-3">
              <b>M. Tech</b>, <span class="text-caption">2025-2026</span>
              <p>Indian Institute of Information Technology</p>
            </div>
            <div class="my-3">
              <b>B. Tech</b>, <span class="text-caption">2021-2025</span>
              <p>Indian Institute of Information Technology</p>
            </div> -->
                    </div>
                    <!-- feedback -->
                    <div class="py-3">
                        <h3 class="text-h4 mb-5">What my students say</h3>
                        <v-row class="mt-3">
                            <v-col cols="12" md="6" v-for="i in 5" :key="i">
                                <v-card variant="outlined" class="pa-4 bg-secondary100">
                                    <div class="float-right">
                                        <SvgSprite name="custom-star" style="width: 18px; height: 18px" class="" />
                                        <SvgSprite name="custom-star" style="width: 18px; height: 18px" class="" />
                                        <SvgSprite name="custom-star" style="width: 18px; height: 18px" class="" />
                                        <SvgSprite name="custom-star" style="width: 18px; height: 18px" class="" />
                                        <SvgSprite name="custom-star-outline" style="width: 18px; height: 18px"
                                            class="" />
                                    </div>
                                    <div class="d-flex align-center gap-3">
                                        <v-avatar size="50" rounded="sm" color="primary" class="">
                                        </v-avatar>
                                        <div class="pl-2" style="min-width: 0">
                                            <div class="text-subtitle-1 text-truncate">
                                                Amit Kumar Sahu
                                            </div>
                                            <p class="text-caption text-medium-emphasis">24/02/2026</p>
                                        </div>
                                    </div>
                                    <p class="mt-5">
                                        Let me tell you what Bhamini Grover is what it actually says on the list
                                        incrediblely helpful and
                                        you must
                                        book a trial lesson now!!!!!!!!!!!!!!!!!!!!!!!!!!
                                    </p>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>


</template>

<style scoped lang="scss">
.profile-sidebar {
    position: sticky;
    top: 80px;
}

// Background Decorative Elements - Base
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

// ============================================
// Style Option 1: Waves Pattern (Active)
// ============================================
.wave-pattern {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.6;
}

// ============================================
// Style Option 2: Geometric Shapes
// ============================================
.geometric-shape {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);

    &.shape-1 {
        width: 120px;
        height: 120px;
        top: -40px;
        right: -30px;
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        transform: rotate(45deg);
    }

    &.shape-2 {
        width: 80px;
        height: 80px;
        bottom: -20px;
        left: -15px;
        border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
    }

    &.shape-3 {
        width: 60px;
        height: 60px;
        top: 30%;
        right: 10%;
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        background: rgba(255, 255, 255, 0.08);
    }

    &.shape-4 {
        width: 40px;
        height: 40px;
        bottom: 30%;
        left: 10%;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
    }
}

// ============================================
// Style Option 3: Gradient Overlay
// ============================================
.gradient-overlay {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.2) 0%, transparent 60%),
        radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
}

// ============================================
// Style Option 4: Dots Pattern
// ============================================
.dots-pattern {
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position:
        0 0,
        10px 10px;
}

@media (max-width: 960px) {
    .profile-sidebar {
        position: relative;
        top: 0;
    }

    // Adjust geometric shapes for mobile
    .geometric-shape {
        &.shape-1 {
            width: 100px;
            height: 100px;
        }

        &.shape-2 {
            width: 60px;
            height: 60px;
        }
    }
}
</style>
