<template>
  <div class="d-flex align-center gap-3">
    <v-avatar
      :size="avatarSize"
      :color="profileData.is_active ? activeColor : inactiveColor"
      variant="tonal"
      class="mr-2"
    >
      <span class="text-body-1 font-weight-bold">
        {{ getInitials }}
      </span>
    </v-avatar>
    <div class="flex-grow-1" style="min-width: 0">
      <div class="d-flex align-center gap-2">
        <div class="flex-grow-1" style="min-width: 0">
          <div
            v-if="showNavigation"
            class="text-body-1 font-weight-medium text-truncate name-link"
            @click.stop="handleNavigate"
          >
            {{ profileData.name || "N/A" }}
          </div>
          <div v-else class="text-body-1 font-weight-medium text-truncate">
            {{ profileData.name || "N/A" }}
          </div>
          <div v-if="showSubtitle" class="text-caption text-medium-emphasis">
            {{ subtitle || profileData.gender || "" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

// Props interface
interface ProfileData {
  [key: string]: any;
  name?: string;
  is_active?: boolean;
  gender?: string;
  user_table_id?: string;
  student_id?: string;
  id?: string | number;
}

interface Props {
  profileData: ProfileData;
  avatarSize?: number | string;
  activeColor?: string;
  inactiveColor?: string;
  showSubtitle?: boolean;
  subtitle?: string;
  showNavigation?: boolean;
  navigationRoute?: string | ((data: ProfileData) => string);
  navigationParam?: string;
}

const props = withDefaults(defineProps<Props>(), {
  avatarSize: 50,
  activeColor: "success",
  inactiveColor: "grey",
  showSubtitle: true,
  showNavigation: true,
  navigationParam: "id",
});

// Emits
const emit = defineEmits<{
  navigate: [data: ProfileData];
  click: [data: ProfileData];
}>();

// Router
const router = useRouter();

// Computed
const getInitials = computed(() => {
  const name = props.profileData?.name || "";
  if (!name) return "?";

  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
});

// Methods
const handleNavigate = () => {
  emit("navigate", props.profileData);
  emit("click", props.profileData);

  if (props.navigationRoute) {
    let route: string;

    if (typeof props.navigationRoute === "function") {
      route = props.navigationRoute(props.profileData);
    } else {
      // Get the ID from profileData
      const id =
        props.profileData[props.navigationParam] ||
        props.profileData.user_table_id ||
        props.profileData.student_id ||
        props.profileData.id;

      route = props.navigationRoute.replace(":id", String(id));
    }

    router.push(route);
  }
};
</script>

<style scoped lang="scss">
.name-link {
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
  position: relative;

  &:hover {
    color: rgb(var(--v-theme-primary));
    text-decoration: underline;
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
}
</style>
