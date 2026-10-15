<script setup lang="ts">
import { ref } from 'vue';
import { mdiAccountSearchOutline, mdiCalendarCheckOutline, mdiChartTimelineVariant } from '@mdi/js';
import Logo from '@/layouts/admin/logo/LogoMain.vue';
import loginImage from '@/assets/images/auth/login-trio.png';
import AuthMobileLogin from '../authForms/AuthMobileLogin.vue';
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

function handleOTPSent(mobile: string, token: string, code: string) {
  mobileNumber.value = mobile;
  dialingCode.value = code;
  otpToken.value = token;
  currentStep.value = 2;
}

function handleBackToLogin() {
  currentStep.value = 1;
}
</script>

<template>
  <v-row class="position-relative signup-page ma-0" no-gutters>
    <div class="bg-blur d-none d-md-block">
      <div class="round-1"></div>
      <div class="round-2"></div>
    </div>

    <v-col cols="12" class="d-flex align-start align-md-center pa-0">
      <v-container fluid class="pa-0">
        <div class="d-flex flex-column align-center justify-center py-0 py-md-6 signup-frame">
          <v-card elevation="0" variant="outlined" rounded="lg"
            class="loginBox bg-surface overflow-hidden w-100 signup-card" max-width="860">
            <v-row no-gutters>
              <v-col cols="12" md="7">
                <v-card-text class="pa-sm-8 pa-6">
                  <div class="text-center mb-md-5 mb-2">
                    <Logo />
                  </div>

                  <v-window v-model="currentStep">
                    <v-window-item :value="1">
                      <AuthMobileLogin @otp-sent="handleOTPSent" />

                      <div class="d-flex align-center my-4">
                        <v-divider />
                        <span class="text-caption text-medium-emphasis px-3">OR</span>
                        <v-divider />
                      </div>

                      <LoginWithGoogle />

                      <p class="text-body-2 text-center mt-4 mb-0 d-none d-md-block">
                        New here?
                        <router-link to="/student/signup"
                          class="text-primary text-decoration-underline font-weight-bold">Sign up as a
                          student</router-link>
                        or
                        <router-link to="/mentor/signup"
                          class="text-primary text-decoration-underline font-weight-bold">a mentor</router-link>
                      </p>
                    </v-window-item>

                    <v-window-item :value="2">
                      <div class="py-3">
                        <AuthCodeVerification :mobile-number="mobileNumber" :dialing-code="dialingCode"
                          :otp-token="otpToken" back-label="Back" @back="handleBackToLogin" />
                      </div>
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-col>
              <v-col cols="12" md="5" class="bg-primary d-none d-md-block">
                <div class="h-100 d-flex flex-column">
                  <div class="signup-side h-100 d-flex flex-column pa-6 pa-md-8 pb-md-0" :style="{
                    backgroundImage: `linear-gradient(to top, rgb(var(--v-theme-primary800)) 0%, rgb(var(--v-theme-primary)) 20%, rgba(var(--v-theme-primary), 0.15) 68%), url(${loginImage})`
                  }">
                    <div class="d-none d-md-flex flex-column ga-4 mt-auto py-6">
                      <div v-for="item in highlights" :key="item.title" class="d-flex align-center ga-3">
                        <v-avatar color="white" size="40" rounded="lg">
                          <v-icon color="primary" size="22" :icon="item.icon" />
                        </v-avatar>
                        <div>
                          <div class="text-body-2 text-white font-weight-bold">{{ item.title }}</div>
                          <div class="text-caption text-primary100 font-weight-medium">{{ item.text }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
          <p class="text-body-1 d-md-none text-center mt-4 mb-0">
            New here?
            <router-link to="/student/signup" class="text-primary text-decoration-underline font-weight-bold">
              Sign up as a student
            </router-link>
            or
            <router-link to="/mentor/signup" class="text-primary text-decoration-underline font-weight-bold">
              a mentor
            </router-link>
          </p>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<style scoped>
.signup-frame {
  min-height: calc(100vh - 148px);
}

.signup-side {
  background-repeat: no-repeat;
  background-position: center top;
  background-size: contain;
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

  .signup-card {
    border-color: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}
</style>
