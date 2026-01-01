<script setup lang="ts">
import { ref } from 'vue';
import Logo from '@/layouts/admin/logo/LogoMain.vue';
import AuthMobileLogin from '../authForms/AuthMobileLogin.vue';
import AuthCodeVerification from '../authForms/AuthCodeVerification.vue';
import LoginWithGoogle from '../authForms/LoginWithGoogle.vue';

const mobileNumber = ref('');
const otpToken = ref('');

// Stepper state
const currentStep = ref(1);

// Google login event handlers
const handleGoogleSuccess = (user: any) => {
  console.log('Google login successful:', user);
  // The LoginWithGoogle component handles the redirect automatically
};

const handleGoogleError = (error: string) => {
  console.error('Google login error:', error);
  // Error is already displayed in the LoginWithGoogle component
};

// Handle OTP sent event from AuthMobileLogin
const handleOTPSent = (mobile: string, token: string) => {
  mobileNumber.value = mobile;
  otpToken.value = token;
  currentStep.value = 2; // Move to OTP verification step
};

// Handle back to login
const handleBackToLogin = () => {
  currentStep.value = 1;
};
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <div class="bg-blur">
      <div class="round-1"></div>
      <div class="round-2"></div>
    </div>
    <!---Login Part-->
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <v-card elevation="0" variant="outlined" rounded="lg" class="loginBox bg-surface">
                <v-card-text class="pa-sm-10 pa-6">
                  <div class="text-center mb-5">
                    <Logo />
                  </div>

                  <!-- Step Indicator -->
                  <div class="step-indicator mb-6" v-if="currentStep > 1">
                    <div class="d-flex align-center justify-center">
                      <div class="step-item" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
                        <div class="step-number">1</div>
                        <div class="step-label">Login</div>
                      </div>
                      <div class="step-connector" :class="{ completed: currentStep > 1 }"></div>
                      <div class="step-item" :class="{ active: currentStep === 2 }">
                        <div class="step-number">2</div>
                        <div class="step-label">Verify OTP</div>
                      </div>
                    </div>
                  </div>

                  <!-- Step Content with v-window (slider without header) -->
                  <v-window v-model="currentStep" class="step-window">
                    <v-window-item :value="1">
                      <!-- Step 1: Login -->
                      <div class="step-content">
                        <!-- Mobile Login Component -->
                        <div class="py-3">
                          <AuthMobileLogin @otp-sent="handleOTPSent" />
                        </div>
                        <v-row>
                          <v-col cols="12" class="d-flex align-center">
                            <v-divider />
                            <div class="orbtn">OR</div>
                            <v-divider />
                          </v-col>
                        </v-row>
                        <div class="text-center">
                          <!-- Social Login Component -->
                          <v-list aria-label="social list" aria-busy="true">
                            <LoginWithGoogle
                              :mobileNumber="mobileNumber"
                              @success="handleGoogleSuccess"
                              @error="handleGoogleError"
                              class="mb-4"
                            />
                          </v-list>
                        </div>
                      </div>
                    </v-window-item>

                    <v-window-item :value="2">
                      <!-- Step 2: OTP Verification -->
                      <div class="step-content">
                        <!-- OTP Verification Component -->
                        <div class="py-3">
                          <AuthCodeVerification :mobileNumber="mobileNumber" :otpToken="otpToken" @back="handleBackToLogin" />
                        </div>
                      </div>
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <!---Login Part-->
  </v-row>
</template>
<style lang="scss">
.loginBox {
  max-width: 475px;
  margin: 0 auto;
}

.step-window {
  overflow: hidden;
}

.step-content {
  width: 100%;
}

.step-indicator {
  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      background-color: rgba(var(--v-theme-on-surface), 0.12);
      color: rgba(var(--v-theme-on-surface), 0.6);
      transition: all 0.3s ease;
    }

    .step-label {
      margin-top: 8px;
      font-size: 12px;
      color: rgba(var(--v-theme-on-surface), 0.6);
      transition: all 0.3s ease;
    }

    &.active {
      .step-number {
        background-color: rgb(var(--v-theme-primary));
        color: rgb(var(--v-theme-on-primary));
      }

      .step-label {
        color: rgb(var(--v-theme-primary));
        font-weight: 600;
      }
    }

    &.completed {
      .step-number {
        background-color: rgb(var(--v-theme-success));
        color: rgb(var(--v-theme-on-success));
      }

      .step-label {
        color: rgb(var(--v-theme-success));
      }
    }
  }

  .step-connector {
    width: 60px;
    height: 2px;
    background-color: rgba(var(--v-theme-on-surface), 0.12);
    margin: 0 16px;
    margin-top: -24px;
    transition: all 0.3s ease;

    &.completed {
      background-color: rgb(var(--v-theme-success));
    }
  }
}
</style>
