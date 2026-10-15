<script setup lang="ts">
import { ref } from 'vue';
import { mdiAccountSearchOutline, mdiCalendarCheckOutline, mdiChartTimelineVariant, mdiSchoolOutline } from '@mdi/js';
import Logo from '@/layouts/admin/logo/LogoMain.vue';
import studentSignupImage from '@/assets/images/auth/student-signup.png';
import StudentSignupForm from '../authForms/StudentSignupForm.vue';
import AuthCodeVerification from '../authForms/AuthCodeVerification.vue';
import LoginWithGoogle from '../authForms/LoginWithGoogle.vue';

const mobileNumber = ref('');
const dialingCode = ref('');
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

function handleOtpSent(mobile: string, token: string, code: string) {
  mobileNumber.value = mobile;
  dialingCode.value = code;
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

    <!-- <header class="signup-hero d-md-none text-center text-white w-100 px-6 pt-8">
      <img src="@/assets/images/auth/singup-logo.png" alt="Student Signup" class=" object-fit-cover" height="80">
      <v-avatar color="white" size="56" rounded="lg" class="mb-4">
        <v-icon color="primary" size="32" :icon="mdiSchoolOutline" />
      </v-avatar>
    </header> -->

    <v-col cols="12" class="d-flex align-start align-md-center pa-0 ">
      <v-container fluid class="pa-0">
        <div class="d-flex flex-column align-center justify-center py-0 py-md-6 signup-frame">
          <v-card elevation="0" variant="outlined" rounded="lg"
            class="loginBox bg-surface overflow-hidden w-100 signup-card" max-width="860">
            <v-row no-gutters class=" ">
              <v-col cols="12" md="7">
                <v-card-text class="pa-sm-8 pa-6">
                  <div class="text-center mb-md-5 mb-2">
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
                        Already have an
                        account?
                        <router-link to="/auth/login"
                          class="text-primary text-decoration-underline font-weight-bold">Sing in</router-link>

                      </p>
                    </v-window-item>

                    <v-window-item :value="2">
                      <div class="py-3">
                        <AuthCodeVerification :mobile-number="mobileNumber" :dialing-code="dialingCode"
                          :otp-token="otpToken" back-label="Back" @back="handleBack" />
                      </div>
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-col>
              <v-col cols="12" md="5" class="bg-primary d-none d-md-block ">
                <div class="h-100 d-flex flex-column">
                  <div class="signup-side h-100 d-flex flex-column pa-6 pa-md-8 pb-md-0 " :style="{
                    backgroundImage: `linear-gradient(to top, rgb(var(--v-theme-primary800)) 0%, rgb(var(--v-theme-primary)) 25%, rgba(var(--v-theme-primary), 0.15) 68%), url(${studentSignupImage})`
                  }">
                    <div class="d-none d-md-flex flex-column ga-4 mt-auto py-6 ">
                      <div v-for="item in highlights" :key="item.title" class="d-flex align-center ga-3">
                        <v-avatar color="white" size="40" rounded="lg">
                          <v-icon color="primary" size="22" :icon="item.icon" />
                        </v-avatar>
                        <div>
                          <div class="text-body-2 text-white font-weight-bold">{{ item.title }}</div>
                          <div class="text-caption text-primary100">{{ item.text }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
          <p v-if="currentStep === 1" class="text-body-1 d-block mt-4 d-md-none text-center">
            Already have an account?
            <router-link to="/auth/login" class="text-primary text-decoration-underline font-weight-bold">
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
  /* background: rgb(var(--v-theme-containerBg)); */
}

.signup-frame {
  min-height: calc(100vh - 148px);
}

.signup-side {
  background-repeat: no-repeat;
  background-position: top right;
  background-size: cover;
}

@media (max-width: 959.98px) {
  .signup-page {
    position: fixed !important;
    inset: 0;
    z-index: 1;
    overflow-y: auto;
    background: rgb(var(--v-theme-surface));
  }

  .signup-frame {
    min-height: 100%;
    align-items: stretch !important;
    justify-content: flex-start !important;
    padding-top: max(12px, env(safe-area-inset-top)) !important;
    padding-bottom: max(16px, env(safe-area-inset-bottom)) !important;
  }

  .signup-login-link {
    padding-inline: 40px;
  }

  .signup-card {
    border-color: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}
</style>
