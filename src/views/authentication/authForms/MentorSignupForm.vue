<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { AxiosResponse } from 'axios';
import { api } from '@/utils/api/axios';
import URLS from '@/utils/urls';
import $keys from '@/utils/keys';
import { emailRules, requiredRule } from '@/utils/rules';
import MobileInputField from '@/components/shared/MobileInputField.vue';
import mentorIllustration from '@/assets/images/auth/mentor-confirm.png';

const emit = defineEmits<{
  otpSent: [mobile: string, otpToken: string, dialingCode: string];
}>();

const router = useRouter();
const form = ref();
const firstName = ref('');
const lastName = ref('');
const mobile = ref('');
const email = ref('');
const countryId = ref<number | null>(null);
const dialingCode = ref('');
const loading = ref(false);
const confirmDialog = ref(false);
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
  confirmDialog.value = true;
}

function declineStudent() {
  confirmDialog.value = false;
  router.push('/student/signup');
}

function cancelConfirm() {
  confirmDialog.value = false;
}

async function confirmMentor() {
  if (countryId.value == null) {
    confirmDialog.value = false;
    errorMessage.value = 'Select a country before continuing.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = (await api.post(
      URLS.USER_SIGNUP,
      {
        name: `${firstName.value.trim()} ${lastName.value.trim()}`.replace(/\s+/g, ' '),
        mobile: mobile.value.trim(),
        country_id: countryId.value,
        email: email.value.trim(),
        account_type: $keys.ACCOUNT_TEACHER
      },
      { returnResponse: true }
    )) as AxiosResponse;

    const otpToken = response.headers['otp_token'] || response.headers['OTP_TOKEN'] || response.headers['otp-token'];
    if (otpToken) {
      emit('otpSent', mobile.value.trim(), String(otpToken), dialingCode.value);
      return;
    }

    successMessage.value = response.data?.message || 'Account created. Sign in to continue.';
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || error.response?.data?.detail || 'Could not create your account. Please try again.';
  } finally {
    loading.value = false;
    confirmDialog.value = false;
  }
}
</script>

<template>
  <div class="px-2">
    <div>
      <h3 class="my-1 text-h3">Welcome to Indian Mentors</h3>
      <p class="text-body-1 text-medium-emphasis mb-0">Create a mentor account and start teaching</p>
    </div>
    <v-form ref="form" class="mt-5 loginForm" @submit.prevent="submit">
      <div class="d-flex flex-column flex-sm-row align-sm-start ga-4 mb-4">
        <v-text-field v-model="firstName" :rules="firstNameRules" class="flex-grow-1" aria-label="first name"
          label="First name" density="comfortable" required hide-details variant="outlined" color="primary"
          placeholder="Aarav" autocomplete="given-name" />
        <v-text-field v-model="lastName" :rules="lastNameRules" class="flex-grow-1" aria-label="last name"
          label="Last name" density="comfortable" required hide-details variant="outlined" color="primary"
          placeholder="Sharma" autocomplete="family-name" />
      </div>

      <MobileInputField v-model="mobile" v-model:country-id="countryId" v-model:dialing-code="dialingCode"
        label="Mobile" class="mb-4" />

      <v-text-field v-model="email" :rules="emailRules" class="mb-4" aria-label="email" label="Email"
        density="comfortable" required variant="outlined" color="primary" placeholder="aarav.sharma@email.com"
        type="email" autocomplete="email" hide-details />

      <v-btn class="mt-4" color="primary" :loading="loading" block variant="flat" size="large" rounded="md"
        type="submit">
        Continue
      </v-btn>
      <p class="text-caption text-medium-emphasis mt-3 mb-0 text-center">
        By continuing, you agree to our
        <router-link to="/terms-of-use" class="text-primary text-decoration-underline">Terms of Use</router-link>
        and
        <router-link to="/privacy-policy" class="text-primary text-decoration-underline">Privacy Policy</router-link>.
        Your next chapter is in safe hands.
      </p>

      <v-alert v-if="errorMessage" color="error" class="mt-4" closable @click:close="errorMessage = ''">
        {{ errorMessage }}
      </v-alert>
      <v-alert v-if="successMessage" color="success" class="mt-4">
        {{ successMessage }}
        <router-link to="/auth/login" class="text-primary text-decoration-none d-block mt-2">Sign in</router-link>
      </v-alert>
    </v-form>

    <v-dialog v-model="confirmDialog" max-width="440" persistent>
      <v-card rounded="lg">
        <v-img :src="mentorIllustration" alt="" :aspect-ratio="1.8" class="mt-5" />
        <v-card-text class="text-center pt-0 pb-2">
          <h3 class="text-h5 mb-2">Are you a mentor?</h3>
          <p class="text-body-2 text-medium-emphasis mb-0 px-4">
            Teach students, set your own schedule, and keep every session in one place.
          </p>
        </v-card-text>
        <v-card-actions class="flex-column ga-3 pa-4 px-8">
          <v-btn color="primary" class="text-none" block variant="flat" rounded="md" :loading="loading"
            @click="confirmMentor">
            Yes, I'm a mentor
          </v-btn>
          <v-btn color="primary" class="text-none" block variant="outlined" rounded="md" :disabled="loading"
            @click="declineStudent">
            No, I'm a student / parent
          </v-btn>
          <v-btn class="text-none" block variant="text" rounded="md" :disabled="loading" @click="cancelConfirm">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
