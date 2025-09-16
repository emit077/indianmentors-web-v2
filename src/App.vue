<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useLocationStore } from "@/stores/location";
import AppLayout from "@/layout/DashboardLayout.vue";

const router = useRouter();
const userStore = useUserStore();
const locationStore = useLocationStore();

onMounted(async () => {
  // Check if user is authenticated
  const token = localStorage.getItem("auth_token");
  if (token && !userStore.isAuthenticated) {
    // Simulate user data loading
    userStore.setUser({
      id: "1",
      name: "John Doe",
      email: "demo@example.com",
      avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    });
  }

  // Check location permission on app start
  if (!locationStore.hasLocation) {
    // Redirect to permission page if location is not available
    if (
      router.currentRoute.value.name !== "permission" &&
      router.currentRoute.value.name !== "login" &&
      router.currentRoute.value.name !== "register"
    ) {
      router.push("/permission");
    }
  }
});
</script>

<template>
  <AppLayout />
</template>
