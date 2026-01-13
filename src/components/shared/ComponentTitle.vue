<script setup lang="ts">
import { mdiChevronRight, mdiHomeVariantOutline } from '@mdi/js';
const props = defineProps({
  config: Object as () => any
});
</script>
<template>
  <v-card elevation="0" variant="text" class="mb-5">
    <v-row no-gutters class="align-center">
      <v-col sm="12">
        <h2 class="text-h2 mb-2 font-weight-bold" v-if="props.config.pageTitle">{{ props.config.pageTitle }}</h2>
        <!-- <h6 class="text-h6 text-lightText mb-2" v-if="props.config.pageDescription">{{ props.config.pageDescription }}</h6> -->
        <!-- <v-breadcrumbs density="compact" v-if="props.config.breadcrumbs" :items="props.config.breadcrumbs">
          <template v-slot:divider>
            <v-icon :icon="mdiChevronRight"></v-icon>
          </template>
        </v-breadcrumbs> -->

        <div class="d-flex">
          <div class="d-flex align-center" v-for="(breadcrumb, i) in props.config.breadcrumbs" :key="breadcrumb.title">
            <v-icon size="small" class="opacity-30" v-if="Number(i) > 0" :icon="mdiChevronRight"></v-icon>
            <RouterLink :to="breadcrumb.to" :disabled="breadcrumb.disabled" style="text-decoration: none; display: inline-block">
              <span
                class="text-subtitle-1 text-hover-primary"
                :class="breadcrumb.disabled ? 'opacity-70 font-weight-300 text-secondary' : 'font-weight-400 cursor-pointer router-link'"
                >{{ breadcrumb.title }}</span
              >
            </RouterLink>
          </div>
        </div>

        <!-- <v-btn
          :href="props.link"
          class="d-inline-flex align-center font-weight-medium mt-3"
          variant="tonal"
          color="secondary"
          rounded="md"
          target="_"
        >
          <svg class="pc-icon mr-2" style="width: 16px; height: 16px">
            <use xlink:href="/assets/svg/sprite.svg#custom-link1"></use>
          </svg>
          Reference
        </v-btn> -->
      </v-col>
    </v-row>
  </v-card>
</template>
<style lang="scss" scoped>
.router-link {
  text-decoration: none;
  display: inline-block;
  color: rgb(var(--v-theme-secondary));
  &:hover {
    color: rgb(var(--v-theme-primary));
    text-decoration: underline !important;
  }
}
</style>
