<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/utils/api/axios';
import URLS from '@/utils/urls';
import MobileInputField from '@/components/shared/MobileInputField.vue';

const form = ref();
const mobileNumber = ref('');
const countryId = ref<number | null>(null);
const dialingCode = ref('');
const loading = ref(false);
const errorMessage = ref('');

const $emit = defineEmits<{
  otpSent: [mobileNumber: string, otpToken: string, dialingCode: string];
}>();

async function handleMobileLogin() {
  const result = await form.value?.validate();
  if (!result?.valid) return;

  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await api.post(URLS.USER_LOGIN, { mobile: mobileNumber.value.trim() }, { returnResponse: true });
    const otpToken = response.headers['OTP_TOKEN'] || response.headers['otp_token'] || response.headers['otp-token'];
    $emit('otpSent', mobileNumber.value.trim(), String(otpToken ?? ''), dialingCode.value);
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || error.response?.data?.detail || 'Could not send the code. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="px-2">
    <h3 class="my-1 text-h3">Welcome back</h3>
    <p class="text-body-1 text-medium-emphasis mb-0">Sign in with the mobile number on your account</p>

    <v-form ref="form" class="mt-5 loginForm" @submit.prevent="handleMobileLogin">
      <MobileInputField v-model="mobileNumber" v-model:country-id="countryId" v-model:dialing-code="dialingCode"
        label="Mobile" class="mb-4" />
      <p class="text-caption text-medium-emphasis mt-n2 mb-0">We'll send you a verification code to your mobile number
      </p>

      <v-btn color="primary" :loading="loading" block class="mt-4" variant="flat" size="large" rounded="md"
        type="submit">
        Continue
      </v-btn>

      <v-alert v-if="errorMessage" color="error" class="mt-4" closable @click:close="errorMessage = ''">
        {{ errorMessage }}
      </v-alert>
    </v-form>
  </div>
</template>
