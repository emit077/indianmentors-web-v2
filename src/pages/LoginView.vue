<template>
  <v-row align="center" justify="center" class="fill-width">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ $t('AUTH.LOGIN_TITLE') }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="login">
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
              :rules="[(v) => !!v || $t('AUTH.PASSWORD_REQUIRED')]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :loading="isLoading" @click="login"> {{ $t('COMMON.LOGIN') }} </v-btn>
        </v-card-actions>
        <v-card-text class="text-center">
          <p>
            {{ $t('AUTH.DONT_HAVE_ACCOUNT') }}
            <router-link to="/register">{{ $t('AUTH.SIGN_UP') }}</router-link>
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const isLoading = ref(false);

const form = ref({
  email: "demo@example.com",
  password: "password123",
});

const login = async () => {
  isLoading.value = true;
  try {
    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Set user data
    userStore.setUser({
      id: "1",
      name: "John Doe",
      email: form.value.email,
      avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    });

    // Set auth token
    localStorage.setItem("auth_token", "demo_token_123");

    // Redirect to dashboard
    router.push("/");
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
