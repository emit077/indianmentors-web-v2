<template>
  <!-- Table Header with Search -->
  <!-- <div v-if="showSearch" class="flex-grow-1" style="max-width: 100%; width: 100%">
    <v-row class="mb-5 justify-end align-center">
      <v-col cols="12" md="4" class="pr-0">
        <v-text-field
          v-model="localSearch"
          :label="searchPlaceholder"
          variant="outlined"
          density="default"
          clearable
          hide-details
          rounded="lg"
          class="search-field"
          @update:model-value="handleSearchChange"
        >
          <template v-slot:prepend-inner>
            <div class="text-lightText d-flex align-center">
              <SvgSprite name="custom-search" style="width: 16px; height: 16px" />
            </div>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="8" class="justify-end d-flex pr-0">
        <slot name="tableController">
          <v-btn
            class="hidden-md-and-down mr-2 ml-0"
            color="secondary"
            icon
            aria-label="sidebar button"
            rounded="sm"
            variant="tonal"
          >
            <SvgSprite name="custom-filter" style="width: 26px; height: 26px" />
          </v-btn>
          <v-btn
            class="hidden-md-and-down mr-5 ml-0"
            color="secondary"
            icon
            aria-label="sidebar button"
            rounded="sm"
            variant="tonal"
          >
            <SvgSprite
              name="custom-document-upload"
              style="width: 28px; height: 28px"
              class="rotate-180"
            />
          </v-btn>
        </slot>
      </v-col>
    </v-row>
  </div>
  <v-divider v-if="showSearch || showHeader" /> -->

  <!-- Data Table -->
  <v-data-table-server
    color="primary"
    v-model:items-per-page="localItemsPerPage"
    :headers="headers"
    :items="items"
    :items-length="totalItems"
    :loading="loading"
    :search="searchTrigger"
    :item-value="itemValue"
    :item-selectable="itemSelectable"
    :show-select="showSelect"
    :show-expand="showExpand"
    hide-default-footer
    class="data-table mt-5"
    @update:options="handleOptionsUpdate"
    @click:row="handleRowClick"
  >
    <!-- Loading State -->
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10" />
    </template>

    <!-- Custom Column Slots -->
    <template
      v-for="header in headers"
      :key="header.key"
      #[`item.${header.key}`]="{ item, value }"
    >
      <!-- profile UI -->
      <div v-if="header.formatType == $keys.DT_PROFILE">
        <DtProfile
          :profile-data="item"
          :avatar-size="45"
          active-color="success"
          inactive-color="grey"
          :show-subtitle="true"
          :show-navigation="true"
          :navigation-route="''"
          @navigate=""
        />
      </div>
      <!-- custome UI -->
      <div v-else-if="header.formatType == $keys.DT_CUSTOM">
        <slot :name="`item.${header.key}`" :item="item" :value="value" :header="header">
        </slot>
      </div>
      <!-- action Btns -->
      <div v-else-if="header.formatType == $keys.DT_BTNS">
        <DtBtn
          btn="{
            icon: value.icon,
            color: value.color,
            title: value.title,
          }"
          @click="handleAction(value.action, item, value.data)"
        ></DtBtn>
      </div>
      <!-- default -->
      <div v-else class="word-break">
        <span>{{ value }}</span>
      </div>
    </template>

    <!-- Expanded Row Slot -->
    <template v-if="showExpand" v-slot:expanded-row="{ item, columns }">
      <tr>
        <td :colspan="columns.length" class="pa-6 bg-surface">
          <slot name="expanded-row" :item="item" :columns="columns" />
        </td>
      </tr>
    </template>

    <!-- No Data State -->
    <template v-slot:no-data>
      <slot name="no-data">
        <div class="text-center pa-8">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-database-off</v-icon>
          <h3 class="text-h6 mb-2">No Data Available</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ noDataMessage }}
          </p>
          <slot name="no-data-actions" />
        </div>
      </slot>
    </template>

    <!-- Footer Filters (if provided) -->
    <template v-if="$slots['tfoot']" v-slot:tfoot>
      <slot name="tfoot" />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import DtProfile from "@/components/datatable/DtProfile.vue";
import DtBtn from "@/components/datatable/DtBtn.vue";
import $keys from "@/utils/keys";

export interface TableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: "asc" | "desc" }[];
  groupBy?: { key: string; order: "asc" | "desc" }[];
  search?: string;
}
// Props
interface Props {
  headers: TableHeader[];
  items: any[];
  totalItems: number;
  loading?: boolean;
  itemsPerPage?: number;
  itemValue?: string | ((item: any) => string | number);
  itemSelectable?: (item: any) => boolean;
  showSelect?: boolean;
  showExpand?: boolean;
  showSearch?: boolean;
  showHeader?: boolean;
  showTotalCount?: boolean;
  showFilteredCount?: boolean;
  searchPlaceholder?: string;
  searchIcon?: string;
  noDataMessage?: string;
  search?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  itemsPerPage: 10,
  itemValue: "id",
  showSelect: false,
  showExpand: false,
  showSearch: true,
  showHeader: true,
  showTotalCount: true,
  showFilteredCount: true,
  searchPlaceholder: "Search...",
  searchIcon: "mdi-magnify",
  noDataMessage: "No data available",
  search: "",
});

// Emits
const emit = defineEmits<{
  "update:options": [options: TableOptions];
  "update:items-per-page": [value: number];
  "update:search": [value: string];
  "row-click": [event: MouseEvent, item: any];
  action: [action: string, item: any, data?: any];
  view: [item: any];
  edit: [item: any];
  delete: [item: any];
  select: [items: any[]];
}>();

// Local state
const localSearch = ref(props.search);
const localItemsPerPage = ref(props.itemsPerPage);
const searchTrigger = ref("");

// Computed
const computedItemValue = computed(() => {
  if (typeof props.itemValue === "function") {
    return props.itemValue;
  }
  return props.itemValue;
});

// Watch for external search changes
watch(
  () => props.search,
  (newValue) => {
    if (newValue !== localSearch.value) {
      localSearch.value = newValue;
    }
  }
);

// Watch for itemsPerPage changes
watch(
  () => props.itemsPerPage,
  (newValue) => {
    if (newValue !== localItemsPerPage.value) {
      localItemsPerPage.value = newValue;
    }
  }
);

watch(localItemsPerPage, (newValue) => {
  emit("update:items-per-page", newValue);
});

// Handlers
const handleSearchChange = (value: string) => {
  localSearch.value = value || "";
  searchTrigger.value = String(Date.now());
  emit("update:search", localSearch.value);
};

const handleOptionsUpdate = (options: TableOptions) => {
  emit("update:options", {
    ...options,
    search: localSearch.value,
  });
};

const handleRowClick = (event: MouseEvent, item: { item: any }) => {
  emit("row-click", event, item.item);
};

// Expose action handlers for child components
const handleAction = (action: string, item: any, data?: any) => {
  emit("action", action, item, data);

  // Emit specific action events
  switch (action) {
    case "view":
      emit("view", item);
      break;
    case "edit":
      emit("edit", item);
      break;
    case "delete":
      emit("delete", item);
      break;
  }
};

// Expose methods
defineExpose({
  handleAction,
});
</script>

<style scoped lang="scss">
.data-table-card {
  overflow: hidden;
}

.data-table {
  :deep(.v-data-table__thead) {
    background-color: rgb(var(--v-theme-surface));
  }

  :deep(.v-data-table__tr) {
    transition: all 0.2s ease;
  }

  :deep(.v-data-table__tr:hover) {
    background: rgb(var(--v-theme-primary), 0.1);
  }

  :deep(.v-data-table__td) {
    padding: 10px;
    border-bottom: solid 1px rgb(var(--v-theme-primary), 0.1) !important;
    border-collapse: collapse;
  }

  :deep(.v-data-table__th) {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }
}

// Mobile optimizations
@media (max-width: 600px) {
  .search-field {
    :deep(.v-field) {
      font-size: 16px; // Prevents zoom on iOS
    }
  }

  .data-table {
    :deep(.v-data-table__td),
    :deep(.v-data-table__th) {
      padding: 12px 8px;
      font-size: 0.875rem;
    }
  }
}

// Touch-friendly buttons
@media (hover: none) and (pointer: coarse) {
  :deep(.v-btn) {
    min-width: 44px;
    min-height: 44px;
  }
}
</style>
