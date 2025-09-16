<template>
  <v-app>
    <!-- <PWAUpdatePrompt /> -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
      app
      class="clean-drawer"
      :width="rail ? 80 : 220"
    >
      <!-- Brand Section -->
      <div class="brand-section" :class="{ 'rail-mode': rail }">
        <v-avatar
          :size="rail ? 40 : 50"
          class="brand-avatar"
          color="primary"
        >
          <v-icon :size="rail ? 24 : 28" color="white">mdi-school</v-icon>
        </v-avatar>
        <div v-if="!rail" class="brand-text">
          <h3 class="brand-title">Indian Mentors</h3>
        </div>
        <v-btn
          v-if="!rail"
          variant="text"
          icon="mdi-chevron-left"
          size="small"
          @click.stop="rail = !rail"
          class="collapse-btn"
        ></v-btn>
      </div>

      <v-divider class="divider-spacing"></v-divider>

      <!-- Navigation Menu -->
      <v-list class="nav-menu" density="comfortable" nav>
        <!-- Dashboard -->
        <v-list-item
          prepend-icon="mdi-chart-line"
          :title="rail ? '' : $t('NAVIGATION.DASHBOARD')"
          value="dashboard"
          :to="{ name: 'dashboard' }"
          class="nav-item"
          :class="{ 'rail-item': rail, 'active': $route.name === 'dashboard' }"
        >
          <template v-if="rail" v-slot:title>
            <v-tooltip location="right">
              <template v-slot:activator="{ props }">
                <span v-bind="props">{{ $t('NAVIGATION.DASHBOARD') }}</span>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>

        <!-- Profile -->
        <v-list-item
          prepend-icon="mdi-account-circle"
          :title="rail ? '' : $t('NAVIGATION.PROFILE')"
          value="profile"
          :to="{ name: 'profile' }"
          class="nav-item"
          :class="{ 'rail-item': rail, 'active': $route.name === 'profile' }"
        >
          <template v-if="rail" v-slot:title>
            <v-tooltip location="right">
              <template v-slot:activator="{ props }">
                <span v-bind="props">{{ $t('NAVIGATION.PROFILE') }}</span>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>

        <!-- Settings -->
        <v-list-item
          prepend-icon="mdi-cog"
          :title="rail ? '' : $t('NAVIGATION.SETTINGS')"
          value="settings"
          :to="{ name: 'settings' }"
          class="nav-item"
          :class="{ 'rail-item': rail, 'active': $route.name === 'settings' }"
        >
          <template v-if="rail" v-slot:title>
            <v-tooltip location="right">
              <template v-slot:activator="{ props }">
                <span v-bind="props">{{ $t('NAVIGATION.SETTINGS') }}</span>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>

        <!-- Permissions -->
        <v-list-item
          prepend-icon="mdi-shield-check"
          :title="rail ? '' : $t('NAVIGATION.PERMISSIONS')"
          value="permissions"
          :to="{ name: 'permission' }"
          class="nav-item"
          :class="{ 'rail-item': rail, 'active': $route.name === 'permission' }"
        >
          <template v-if="rail" v-slot:title>
            <v-tooltip location="right">
              <template v-slot:activator="{ props }">
                <span v-bind="props">{{ $t('NAVIGATION.PERMISSIONS') }}</span>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
      </v-list>

      <!-- Pro Card Section -->
      <template v-slot:append>
        <div class="pro-card" :class="{ 'rail-mode': rail }">
          <div v-if="!rail" class="pro-content">
            <div class="pro-header">
              <h4 class="pro-title">Indian Mentors Pro</h4>
              <v-icon size="16" color="white">mdi-crown</v-icon>
            </div>
            <p class="pro-description">Get access to all features</p>
            <v-btn
              color="white"
              variant="flat"
              size="small"
              class="pro-btn"
            >
              Get Pro
            </v-btn>
          </div>
          <v-btn
            v-else
            color="primary"
            variant="flat"
            icon="mdi-crown"
            class="pro-btn-rail"
          >
            <v-tooltip location="right">
              <template v-slot:activator="{ props }">
                <span v-bind="props">Get Pro</span>
              </template>
            </v-tooltip>
          </v-btn>
        </div>
        
        <!-- Sign Out -->
        <div class="sign-out-section" :class="{ 'rail-mode': rail }">
          <v-btn
            v-if="!rail"
            variant="text"
            @click="logout"
            class="sign-out-btn"
            prepend-icon="mdi-logout"
          >
            Sign Out
          </v-btn>
          <v-btn
            v-else
            variant="text"
            icon="mdi-logout"
            @click="logout"
            class="sign-out-btn-rail"
          >
            <v-tooltip location="right">
              <template v-slot:activator="{ props }">
                <span v-bind="props">Sign Out</span>
              </template>
            </v-tooltip>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar class="clean-app-bar" elevation="0" color="white">
      <!-- Left Section -->
      <div class="app-bar-left">
        <v-btn
          icon
          variant="text"
          @click="drawer = !drawer"
          class="menu-btn"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <h1 class="page-title">{{ getPageTitle() }}</h1>
      </div>

      <!-- Center Section - Search -->
      <div class="app-bar-center">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search here..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          class="search-field"
        ></v-text-field>
      </div>

      <!-- Right Section -->
      <div class="app-bar-right">
        <!-- Language Switcher -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="language-btn"
              prepend-icon="mdi-flag"
            >
              Eng (US)
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(language, code) in languages"
              :key="code"
              :value="code"
              @click="changeLanguage(code)"
            >
              <v-list-item-title>{{ language }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Notifications -->
        <v-btn
          icon
          variant="text"
          @click="showNotifications = !showNotifications"
          class="notification-btn"
        >
          <v-badge
            :content="notificationStore.unreadCount"
            :model-value="notificationStore.unreadCount > 0"
            color="error"
            dot
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <!-- User Profile -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="user-profile-btn"
            >
              <v-avatar size="32" class="user-avatar-small">
                <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
              </v-avatar>
              <div class="user-info-small">
                <span class="user-name-small">{{ userStore.user?.name || 'User' }}</span>
                <span class="user-role-small">Admin</span>
              </div>
              <v-icon size="16">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list class="user-menu">
            <v-list-item
              prepend-icon="mdi-account"
              :title="$t('NAVIGATION.PROFILE')"
              :to="{ name: 'profile' }"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-cog"
              :title="$t('NAVIGATION.SETTINGS')"
              :to="{ name: 'settings' }"
            ></v-list-item>
            <v-divider></v-divider>
            <v-list-item
              prepend-icon="mdi-logout"
              :title="$t('COMMON.LOGOUT')"
              @click="logout"
            ></v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main class="fill-height">
      <v-container fluid class="fill-height">
        <router-view />
      </v-container>
    </v-main>

    <!-- Notifications Panel -->
    <v-navigation-drawer
      v-model="showNotifications"
      location="right"
      temporary
      width="400"
    >
      <v-toolbar>
        <v-toolbar-title>{{ $t('NAVIGATION.NOTIFICATIONS') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="showNotifications = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list>
        <v-list-item
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          :class="{ 'bg-grey-lighten-4': !notification.read }"
        >
          <template v-slot:prepend>
            <v-icon :color="notification.read ? 'grey' : 'primary'"> mdi-bell </v-icon>
          </template>

          <v-list-item-title>{{ notification.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ notification.body }}</v-list-item-subtitle>
          <v-list-item-subtitle class="text-caption">
            {{ formatTime(notification.timestamp) }}
          </v-list-item-subtitle>

          <template v-slot:append>
            <v-btn
              icon
              size="small"
              @click="notificationStore.removeNotification(notification.id)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-list-item>

        <v-list-item v-if="notificationStore.notifications.length === 0">
          <v-list-item-title class="text-center text-grey">
            {{ $t('COMMON.NO_NOTIFICATIONS') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            variant="outlined"
            @click="notificationStore.clearAllNotifications()"
            :disabled="notificationStore.notifications.length === 0"
          >
            {{ $t('COMMON.CLEAR_ALL') }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useThemeStore } from "@/stores/theme";
import { useNotificationStore } from "@/stores/notifications";
import { useI18n } from "vue-i18n";
// import PWAUpdatePrompt from "./PWAUpdatePrompt.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const themeStore = useThemeStore();
const notificationStore = useNotificationStore();
const { locale, t } = useI18n();

const drawer = ref(true);
const rail = ref(false);
const showNotifications = ref(false);
const searchQuery = ref("");

const languages = {
  en: t('LANGUAGES.ENGLISH'),
  hi: t('LANGUAGES.HINDI'),
  es: t('LANGUAGES.SPANISH'),
  fr: t('LANGUAGES.FRENCH')
};

const getPageTitle = () => {
  const routeNames = {
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'settings': 'Settings',
    'permission': 'Permissions',
    'login': 'Login',
    'register': 'Register'
  };
  return routeNames[route.name] || 'Dashboard';
};

const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('preferred-language', lang);
};

const logout = () => {
  userStore.clearUser();
  localStorage.removeItem("auth_token");
  router.push("/login");
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(date);
};
</script>

<style>
@import '@/assets/drawer.css';
</style>
