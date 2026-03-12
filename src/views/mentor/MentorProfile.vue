<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/utils/api/axios';
import URLS from '@/utils/urls';
import ConfigField from '@/components/shared/ConfigField.vue';
import male from '@/assets/images/gender/male.png';
import female from '@/assets/images/gender/female.png';
import CommonHelpers from '@/utils/helpers/helper-functions';
import ComponentTitle from '@/components/shared/ComponentTitle.vue';
import pageConfig from './config/mentor_profile';
import { mdiPhoneOutline, mdiEmailOutline, mdiMapMarkerOutline, mdiClockOutline } from '@mdi/js';
import { useRoute } from 'vue-router';
import { decrypt } from '@/utils/helpers/crypto';
import { computed } from 'vue';

const mobileScreen = CommonHelpers.isMobile();
const route = useRoute();
const loading = ref(false);
const error = ref<string | null>(null);
const tutorId = computed(() => decrypt(String(route.params.id)));

const tutorData = ref<any>({});

const fetchTutorProfile = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await api.get<any>(URLS.TUTOR_PROFILE, { params: { tutor_table_id: tutorId.value } });
        if (response) {
            tutorData.value = response;
        }
    } catch (err: any) {
        console.error('Error fetching mentor profile:', err);
        if (err.response?.status === 404) {
            error.value = 'No mentor profile found for this tutor.';
        } else {
            error.value = err.message || 'Failed to load mentor profile';
        }
    } finally {
        loading.value = false;
    }
};

const scrollToSection = (sectionKey: string) => {
    const element = document.getElementById(sectionKey);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

onMounted(() => {
    fetchTutorProfile();
});
</script>

<template>
    <ComponentTitle :config="pageConfig.pageHeaderConfig" />

    <!-- Loading State -->
    <v-row v-if="loading">
        <v-col cols="12" md="3">
            <v-skeleton-loader type="card-avatar, article" elevation="0" />
        </v-col>
        <v-col cols="12" md="9">
            <v-skeleton-loader type="article, article" class="mb-4" elevation="0" />
        </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error" class="justify-center">
        <v-col cols="12" md="8">
            <v-card rounded="md" variant="flat" color="white" class="pa-8 text-center">
                <v-icon size="80" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
                <h2 class="text-h5 mb-3">Oops! Something went wrong</h2>
                <p class="text-body-1 text-medium-emphasis mb-6">{{ error }}</p>
                <v-btn color="primary" size="large" rounded="md" @click="fetchTutorProfile">
                    <v-icon start>mdi-refresh</v-icon>
                    Retry
                </v-btn>
            </v-card>
        </v-col>
    </v-row>

    <!-- Main Content -->
    <v-row v-else>
        <!-- Sidebar Profile Card -->
        <v-col cols="12" md="3" class="mb-4">
            <v-card rounded="md" class="mb-4 v-card--variant-outlined" variant="flat" color="white">
                <!-- Profile Header -->
                <v-sheet color="primary" class="pa-6 text-center rounded-md position-relative overflow-hidden"
                    style="border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important">
                    <div class="bg-decoration">
                        <svg class="wave-pattern" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path
                                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                                fill="rgba(255,255,255,0.1)" />
                        </svg>
                    </div>

                    <div class="position-relative d-inline-block mb-4" style="z-index: 1">
                        <v-progress-circular :model-value="tutorData.profile_completion_per || 0" :rotate="-90"
                            :size="mobileScreen ? 110 : 130" :width="6" color="white">
                            <v-avatar :size="mobileScreen ? 96 : 114">
                                <v-img v-if="tutorData.gender === 'Male'" :src="male" :alt="tutorData.gender" cover />
                                <v-img v-else-if="tutorData.gender === 'Female'" :src="female" :alt="tutorData.gender"
                                    cover />
                                <v-icon v-else :size="mobileScreen ? 50 : 60">mdi-account</v-icon>
                            </v-avatar>
                        </v-progress-circular>
                        <v-chip color="success" size="x-small" variant="flat" class="completion-badge">
                            {{ Math.round(tutorData.profile_completion_per || 0) }}%
                        </v-chip>
                    </div>

                    <div style="position: relative; z-index: 1">
                        <h3 class="text-h5 font-weight-bold mb-2 text-white">
                            {{ tutorData.name || 'Mentor Name' }}
                        </h3>
                        <v-chip size="small" variant="tonal" color="white" class="mb-2">
                            #{{ tutorData.tutor_id || 'N/A' }}
                        </v-chip>
                        <div class="d-flex align-center justify-center mt-3">
                            <v-icon size="x-small" color="white" class="mr-1" :icon="mdiClockOutline" />
                            <span class="text-caption text-white">Last Active: Just Now</span>
                        </div>
                    </div>
                </v-sheet>

                <!-- Contact Info -->
                <v-card-text class="pa-4">
                    <v-list density="compact" class="bg-transparent">
                        <v-list-item v-if="tutorData.mobile" class="px-0 mb-2">
                            <template #prepend>
                                <v-avatar color="primary" size="40" class="mr-3">
                                    <v-icon size="18" :icon="mdiPhoneOutline" />
                                </v-avatar>
                            </template>
                            <v-list-item-title class="text-caption text-medium-emphasis">
                                Phone Number
                            </v-list-item-title>
                            <v-list-item-subtitle class="text-body-2 font-weight-medium">
                                +91 {{ tutorData.mobile }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="tutorData.email" class="px-0 mb-2">
                            <template #prepend>
                                <v-avatar color="secondary" size="40" class="mr-3">
                                    <v-icon size="18" :icon="mdiEmailOutline" />
                                </v-avatar>
                            </template>
                            <v-list-item-title class="text-caption text-medium-emphasis">
                                Email Address
                            </v-list-item-title>
                            <v-list-item-subtitle class="text-body-2 font-weight-medium text-truncate">
                                {{ tutorData.email }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="tutorData.city" class="px-0">
                            <template #prepend>
                                <v-avatar color="info" size="40" class="mr-3">
                                    <v-icon size="18" :icon="mdiMapMarkerOutline" />
                                </v-avatar>
                            </template>
                            <v-list-item-title class="text-caption text-medium-emphasis">
                                Location
                            </v-list-item-title>
                            <v-list-item-subtitle class="text-body-2 font-weight-medium">
                                {{ tutorData.city }}, {{ tutorData.state }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>

            <!-- Quick Navigation -->
            <v-sheet class="bg-transparent profile-sidebar" sticky>
                <v-card rounded="md" class="mb-4 v-card--variant-outlined" variant="flat" color="white">
                    <v-card-title class="d-flex align-center">
                        <span class="text-subtitle-1">Quick Navigation</span>
                    </v-card-title>
                    <v-divider />
                    <v-card-text class="pa-2">
                        <v-list density="compact" class="bg-transparent">
                            <v-list-item v-for="(section, idx) in pageConfig.mentorProfileConfig"
                                :key="section.sectionKey" rounded="md" class="mb-1"
                                @click="scrollToSection(section.sectionKey)">
                                <template #prepend>
                                    <v-chip size="small" color="primary" variant="flat" class="mr-2">
                                        {{ String(Number(idx) + 1).padStart(2, '0') }}
                                    </v-chip>
                                </template>
                                <v-list-item-title class="text-body-2">
                                    {{ section.title }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-sheet>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="9">
            <v-card v-for="(section, index) in pageConfig.mentorProfileConfig" :key="section.sectionKey"
                :id="section.sectionKey" class="mb-4 v-card--variant-outlined" variant="flat" color="white">
                <v-card-item class="pa-4">
                    <div class="d-flex align-center justify-space-between flex-wrap">
                        <div class="d-flex align-center">
                            <v-chip color="primary" variant="flat" size="large" class="mr-3">
                                {{ String(Number(index) + 1).padStart(2, '0') }}
                            </v-chip>
                            <div>
                                <v-card-title class="pa-0 text-h5">
                                    {{ section.title }}
                                </v-card-title>
                            </div>
                        </div>
                    </div>
                </v-card-item>

                <v-divider />

                <v-card-text class="pa-4 pa-md-6">
                    <v-row>
                        <ConfigField v-for="field in section.fields" :key="field.data" :config="field"
                            :data="tutorData" />
                    </v-row>
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

.completion-badge {
    position: absolute;
    bottom: 5px;
    right: 5px;
}

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

@media (max-width: 960px) {
    .profile-sidebar {
        position: relative;
        top: 0;
    }
}
</style>