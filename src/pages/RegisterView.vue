<template>
  <div class="fill-height d-flex align-center justify-center">
    <v-row align="center" justify="center" class="fill-width">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{ $t('AUTH.REGISTER_TITLE') }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="form.name"
                :label="$t('PROFILE.NAME')"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                variant="outlined"
                :rules="[(v) => !!v || $t('PROFILE.NAME') + ' is required']"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.email"
                :label="$t('AUTH.EMAIL')"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                variant="outlined"
                :rules="[
                  (v) => !!v || $t('AUTH.EMAIL_REQUIRED'),
                  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                :label="$t('AUTH.PASSWORD')"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                variant="outlined"
                :rules="[
                  (v) => !!v || $t('AUTH.PASSWORD_REQUIRED'),
                  (v) => v.length >= 6 || $t('AUTH.PASSWORD_TOO_SHORT'),
                ]"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.confirmPassword"
                :label="$t('AUTH.CONFIRM_PASSWORD')"
                name="confirmPassword"
                prepend-icon="mdi-lock-check"
                type="password"
                variant="outlined"
                :rules="[
                  (v) => !!v || 'Please confirm password',
                  (v) => v === form.password || $t('AUTH.PASSWORDS_DO_NOT_MATCH'),
                ]"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :loading="isLoading" @click="register">
              {{ $t('COMMON.REGISTER') }}
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            <p>
              {{ $t('AUTH.ALREADY_HAVE_ACCOUNT') }} <router-link to="/login">{{ $t('AUTH.SIGN_IN') }}</router-link>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const isLoading = ref(false);

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const register = async () => {
  isLoading.value = true;
  try {
    // Simulate register API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Set user data
    userStore.setUser({
      id: "1",
      name: form.value.name,
      email: form.value.email,
      avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    });

    // Set auth token
    localStorage.setItem("auth_token", "demo_token_123");

    // Redirect to dashboard
    router.push("/");
  } catch (error) {
    console.error("Registration failed:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
