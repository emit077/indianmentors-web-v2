<script setup lang="ts">
import { ref } from 'vue';
import { mdiAccountSearchOutline, mdiCalendarCheckOutline, mdiChartTimelineVariant, mdiSchoolOutline } from '@mdi/js';
import Logo from '@/layouts/admin/logo/LogoMain.vue';
import StudentSignupForm from '../authForms/StudentSignupForm.vue';
import AuthCodeVerification from '../authForms/AuthCodeVerification.vue';
import LoginWithGoogle from '../authForms/LoginWithGoogle.vue';

const mobileNumber = ref('');
const otpToken = ref('');
const currentStep = ref(1);

const highlights = [
  {
    icon: mdiAccountSearchOutline,
    title: 'Find a mentor',
    text: 'Browse tutors who teach your subject'
  },
  {
    icon: mdiCalendarCheckOutline,
    title: 'Book sessions',
    text: 'Pick a time that fits your schedule'
  },
  {
    icon: mdiChartTimelineVariant,
    title: 'Track progress',
    text: 'Keep your learning in one place'
  }
];

function handleOtpSent(mobile: string, token: string) {
  mobileNumber.value = mobile;
  otpToken.value = token;
  currentStep.value = 2;
}

function handleBack() {
  currentStep.value = 1;
}
</script>

<template>
  <v-row class="position-relative signup-page ma-0" no-gutters>
    <div class="bg-blur d-none d-md-block">
      <div class="round-1"></div>
      <div class="round-2"></div>
    </div>

    <header class="signup-hero d-md-none bg-primary text-center text-white w-100 px-6 pt-10">
      <v-avatar color="white" size="56" rounded="lg" class="mb-4">
        <v-icon color="primary" size="32" :icon="mdiSchoolOutline" />
      </v-avatar>
    </header>

    <v-col cols="12" class="d-flex align-start align-md-center pa-0 ">
      <v-container fluid class="pa-0">
        <div class="d-flex flex-column align-center justify-center py-0 py-md-6 signup-frame">
          <v-card elevation="0" variant="outlined" rounded="lg"
            class="loginBox bg-surface overflow-hidden w-100 signup-card" max-width="960">
            <v-row no-gutters class="elevation-5 ">
              <v-col cols="12" md="5" class="bg-primary d-none d-md-block">
                <div class="pa-6 pa-md-8 h-100 d-flex flex-column">
                  <div>
                    <div class="d-flex align-center ga-4">
                      <v-avatar color="white" size="56" rounded="lg">
                        <v-icon color="primary" size="32" :icon="mdiSchoolOutline" />
                      </v-avatar>
                      <div>
                        <div class="text-caption text-primary100 font-weight-medium">Sign up as a student</div>
                        <div class="text-h5 text-white font-weight-bold">Create an account</div>
                      </div>
                    </div>

                    <p class="text-body-2 text-primary100 mt-4 mb-0 d-none d-md-block">
                      Create a student account, find a mentor, and start learning.
                    </p>
                  </div>

                  <div class="d-none d-md-flex flex-column ga-4 mt-auto pt-8">
                    <div v-for="item in highlights" :key="item.title" class="d-flex align-center ga-3">
                      <v-avatar color="white" size="40" rounded="lg">
                        <v-icon color="primary" size="22" :icon="item.icon" />
                      </v-avatar>
                      <div>
                        <div class="text-body-2 text-white font-weight-medium">{{ item.title }}</div>
                        <div class="text-caption text-primary100">{{ item.text }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="7">
                <v-card-text class="pa-sm-8 pa-6">
                  <div class="text-center mb-5 d-none d-md-block">
                    <Logo />
                  </div>

                  <v-window v-model="currentStep">
                    <v-window-item :value="1">
                      <StudentSignupForm @otp-sent="handleOtpSent" />

                      <div class="d-flex align-center my-4">
                        <v-divider />
                        <span class="text-caption text-medium-emphasis px-3">OR</span>
                        <v-divider />
                      </div>

                      <LoginWithGoogle />

                      <p class="text-body-2 text-center mt-4 mb-0 d-none d-md-block">
                        <router-link to="/auth/login" class="text-primary text-decoration-none">Already have an
                          account?</router-link>
                      </p>
                    </v-window-item>

                    <v-window-item :value="2">
                      <div class="py-3">
                        <AuthCodeVerification :mobile-number="mobileNumber" :otp-token="otpToken" back-label="Back"
                          @back="handleBack" />
                      </div>
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>

          <p v-if="currentStep === 1" class="signup-footer d-md-none text-center text-body-2 mt-8 mb-6">
            Already have an account?
            <router-link to="/auth/login" class="text-primary text-decoration-none font-weight-bold mt-1">
              Sign in
            </router-link>
          </p>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<style scoped>
.signup-page {
  background: rgb(var(--v-theme-containerBg));
}

.signup-frame {
  min-height: calc(100vh - 148px);
}

@media (max-width: 959.98px) {
  .signup-page {
    min-height: 100dvh;
    background: rgb(var(--v-theme-secondary100));
    margin-top: -16px !important;
    margin-bottom: -16px !important;
  }

  .signup-hero {
    min-height: 280px;
    padding-top: max(48px, env(safe-area-inset-top));
    padding-bottom: 96px !important;
  }

  .signup-frame {
    min-height: 0;
    margin-top: -150px;
    padding: 0 16px 16px;
    align-items: stretch;
    justify-content: flex-start;
  }

  .signup-card {
    border-radius: 20px !important;
    border-color: transparent !important;
    box-shadow: 0 10px 28px rgba(var(--v-theme-on-surface), 0.12);
  }

  .signup-footer {
    padding-bottom: max(8px, env(safe-area-inset-bottom));
  }
}
</style>
