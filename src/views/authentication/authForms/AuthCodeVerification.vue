<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Props
interface Props {
  mobileNumber?: string;
  otpToken?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mobileNumber: '',
  otpToken: ''
});

// Emit events
const emit = defineEmits<{
  back: [];
}>();

const otp = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const resendLoading = ref(false);
const resendCooldown = ref(0);

// Countdown timer for resend
let countdownInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  // Start countdown if needed
  startResendCountdown();
});

// Handle back to login
const handleBack = () => {
  emit('back');
};

const startResendCountdown = () => {
  resendCooldown.value = 30;
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  countdownInterval = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    }
  }, 1000);
};

const handleVerifyOTP = async () => {
  if (!otp.value || otp.value.length !== 6) {
    errorMessage.value = 'Please enter a valid 6-digit OTP';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Pass OTP token from props if available, otherwise let store use pendingLogin
    const result = await authStore.verifyOTP(otp.value, props.otpToken || undefined);
    successMessage.value = result.message || 'Login successful! Redirecting...';

    // Router will handle redirect in the store
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || error.message || 'Invalid OTP. Please try again.';
    otp.value = ''; // Clear OTP on error
  } finally {
    loading.value = false;
  }
};

const handleResendOTP = async () => {
  if (resendCooldown.value > 0) {
    return; // Still in cooldown
  }

  resendLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Pass OTP token from props if available, otherwise let store use pendingLogin
    const result = await authStore.resendOTP(props.otpToken || undefined);
    successMessage.value = result.message || 'OTP resent successfully!';
    startResendCountdown(); // Restart countdown
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || error.message || 'Failed to resend OTP. Please try again.';
  } finally {
    resendLoading.value = false;
  }
};

// Cleanup on unmount
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<template>
  <div class="d-flex justify-space-between align-center mt-4">
    <h3 class="text-h3 text-center mb-0">Verification Code</h3>
    <span class="text-primary text-decoration-none cursor-pointer" @click="handleBack">Back to Login</span>
  </div>
  <div>
    <p class="text-h6 my-6">
      Verification code sent to <strong>{{ props.mobileNumber }}</strong>
    </p>

    <v-form class="mt-7 loginForm" @submit.prevent="handleVerifyOTP">
      <v-otp-input
        type="number"
        v-model="otp"
        length="6"
        class="mb-5"
        rounded="md"
        single-line
        height="46"
        :disabled="loading"
        @finish="handleVerifyOTP"
      ></v-otp-input>

      <v-btn
        color="primary"
        block
        class="mt-8"
        variant="flat"
        rounded="md"
        size="large"
        type="submit"
        :loading="loading"
        :disabled="!otp || otp.length !== 6 || loading"
      >
        {{ loading ? 'Verifying...' : 'Continue' }}
      </v-btn>
    </v-form>

    <!-- Error Message -->
    <v-alert v-if="errorMessage" type="error" class="mt-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <!-- Success Message -->
    <v-alert v-if="successMessage" type="success" class="mt-4">
      {{ successMessage }}
    </v-alert>

    <!-- Resend OTP -->
    <div class="d-sm-flex align-start justify-space-between mt-6">
      <div class="text-subtitle-1 font-weight-regular">Not received Code?</div>
      <v-btn
        variant="text"
        color="primary"
        class="text-capitalize mr-n2 mt-2 mt-sm-0"
        :disabled="resendCooldown > 0 || resendLoading"
        :loading="resendLoading"
        @click="handleResendOTP"
      >
        {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss">
.loginForm {
  .v-otp-input {
    padding: 0;
    .v-otp-input__content {
      max-width: 95%;
      padding: 0;
    }
    .v-otp-input__field {
      font-size: 13px;
      font-weight: bold;
    }
  }
}
</style>
