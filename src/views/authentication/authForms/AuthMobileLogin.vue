<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';
import { mobileRules } from '@/utils/rules';

const authStore = useAuthStore();

const mobileNumber = ref('');
const loading = ref(false);
const errorMessage = ref('');

// Emit events
const emit = defineEmits<{
  otpSent: [mobileNumber: string, otpToken: string];
}>();

/* eslint-disable @typescript-eslint/no-explicit-any */
async function handleMobileLogin(values: any, { setErrors }: any) {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await authStore.sendMobileOTP(mobileNumber.value);
    // Emit event to parent to move to OTP step with mobile number and OTP token
    console.log('result', result);
    emit('otpSent', mobileNumber.value, result.otpToken || '');
  } catch (error: any) {
    // Handle error
    const errorMsg = error.response?.data?.message || error.message || 'Failed to send OTP. Please try again.';
    errorMessage.value = errorMsg;
    setErrors({ apiError: errorMsg });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="d-flex justify-space-between align-center mt-4">
    <h3 class="text-h3 text-center mb-0">Login</h3>
    <router-link to="/auth/register1" class="text-primary text-decoration-none">Don't Have an account?</router-link>
  </div>

  <Form @submit="handleMobileLogin" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <div class="mb-6">
      <v-label>Mobile Number</v-label>
      <v-text-field
        aria-label="mobile number"
        v-model="mobileNumber"
        :rules="mobileRules"
        class="mt-2"
        density="comfortable"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
        placeholder="9876543210"
        type="tel"
        maxlength="10"
      >
        <template v-slot:prepend-inner>
          <span class="text-body-1 font-weight-bold opacity-50"> +91 </span>
        </template>
      </v-text-field>
      <p class="text-caption text-medium-emphasis mt-2">We'll send you a verification code via SMS</p>
    </div>

    <v-btn color="primary" :loading="loading || isSubmitting" block class="mt-5" variant="flat" size="large" rounded="md" type="submit">
      Send OTP
    </v-btn>

    <div v-if="errors.apiError || errorMessage" class="mt-2">
      <v-alert color="error">{{ errors.apiError || errorMessage }}</v-alert>
    </div>

    <div class="text-center mt-4">
      <router-link to="/auth/register1" class="text-primary text-decoration-none"> Don't have an account? Sign up </router-link>
    </div>
  </Form>
</template>

<style lang="scss">
.loginForm {
  .v-text-field {
    .v-field__prepend-inner {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
</style>
