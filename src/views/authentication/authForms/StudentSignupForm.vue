<script setup lang="ts">
import { ref } from 'vue';
import type { AxiosResponse } from 'axios';
import { mdiSchoolOutline } from '@mdi/js';
import { api } from '@/utils/api/axios';
import URLS from '@/utils/urls';
import { emailRules, mobileRules, requiredRule } from '@/utils/rules';

const emit = defineEmits<{
  otpSent: [mobile: string, otpToken: string];
}>();

const form = ref();
const firstName = ref('');
const lastName = ref('');
const mobile = ref('');
const email = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const firstNameRules = [
  ...requiredRule('First name'),
  (v: string) => !v || v.trim().length >= 2 || 'First name must be at least 2 characters'
];

const lastNameRules = [
  ...requiredRule('Last name'),
  (v: string) => !v || v.trim().length >= 2 || 'Last name must be at least 2 characters'
];

async function submit() {
  const result = await form.value?.validate();
  if (!result?.valid) return;

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = (await api.post(
      URLS.USER_SIGNUP,
      {
        name: `${firstName.value.trim()} ${lastName.value.trim()}`.replace(/\s+/g, ' '),
        mobile: mobile.value.trim(),
        email: email.value.trim(),
        account_type: 'Student'
      },
      { returnResponse: true }
    )) as AxiosResponse;

    const otpToken = response.headers['otp_token'] || response.headers['OTP_TOKEN'] || response.headers['otp-token'];
    if (otpToken) {
      emit('otpSent', mobile.value.trim(), String(otpToken));
      return;
    }

    successMessage.value = response.data?.message || 'Account created. Sign in to continue.';
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || error.response?.data?.detail || 'Could not create your account. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h3 class="my-1 text-h3 ">Student sign up</h3>
  <p class="text-body-1 text-medium-emphasis mb-0">Create a student account and find a mentor</p>

  <v-form ref="form" class="mt-5 loginForm " @submit.prevent="submit">
    <div class="d-flex flex-column flex-sm-row align-sm-start ga-4 mb-4">
      <v-text-field v-model="firstName" :rules="firstNameRules" class="flex-grow-1" aria-label="first name"
        label="First name" density="comfortable" required hide-details="auto" variant="outlined" color="primary"
        placeholder="Aarav" autocomplete="given-name" />
      <v-text-field v-model="lastName" :rules="lastNameRules" class="flex-grow-1" aria-label="last name"
        label="Last name" density="comfortable" required hide-details="auto" variant="outlined" color="primary"
        placeholder="Sharma" autocomplete="family-name" />
    </div>

    <v-text-field v-model="mobile" :rules="mobileRules" class="mb-4" aria-label="mobile number" label="Mobile"
      density="comfortable" required hide-details="auto" variant="outlined" color="primary" placeholder="9876543210"
      type="tel" maxlength="10" autocomplete="tel">
      <template #prepend-inner>
        <span class="text-body-2 font-weight-medium text-medium-emphasis">+91</span>
      </template>
    </v-text-field>

    <v-btn class="mt-6" color="primary" :loading="loading" block variant="flat" size="large" rounded="md" type="submit">
      Sign up
    </v-btn>


    <v-alert v-if="errorMessage" color="error" class="mt-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>
    <v-alert v-if="successMessage" color="success" class="mt-4">
      {{ successMessage }}
      <router-link to="/auth/login" class="text-primary text-decoration-none d-block mt-2">Sign in</router-link>
    </v-alert>
  </v-form>
</template>
