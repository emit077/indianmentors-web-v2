<script setup lang="ts">
import { mdiCheckDecagram } from "@mdi/js";
import $keys from "@/utils/keys";
import type { ProfileListGroup } from "@/configs/student/student_list";

const props = defineProps<{
  config: ProfileListGroup[]; // or ProfileListItem[] if using union
  data: any; // TODO: replace with a typed Student interface
}>();
</script>

<template>
  <v-card flat variant="outlined" class="mt-5 pa-2" style="background-color: white">
    <v-row no-gutters>
      <v-col
        v-for="(item, i) in props.config"
        :key="i"
        class="pa-3"
        :class="item.className"
      >
        <div v-for="(con, j) in item.childs" :key="j">
          <!-- profile card -->
          <div class="d-flex align-top" v-if="con.formatType === $keys.DT_PROFILE">
            <div class="text-center">
              <div>
                <v-progress-circular
                  :model-value="70"
                  :rotate="180"
                  :size="58"
                  :width="5"
                  color="primary"
                >
                  <v-avatar size="50" color="secondary" variant="flat">
                    <span class="text-body-1 font-weight-bold">
                      {{ (props.data.name || "M").charAt(0).toUpperCase() }}
                    </span>
                  </v-avatar>
                </v-progress-circular>
              </div>
              <p class="text-subtitle-1 font-weight-medium mt-2">70%</p>
            </div>

            <div class="flex-grow-1 pl-4" style="min-width: 0">
              <div class="d-flex align-top">
                <div class="flex-grow-1" style="min-width: 0">
                  <div class="d-flex align-center text-subtitle-1">
                    <div
                      class="text-subtitle-1 font-weight-medium text-truncate"
                      style="max-width: 90%"
                    >
                      {{ data.name }}
                    </div>
                    <v-icon :icon="mdiCheckDecagram" color="success" />
                  </div>

                  <p class="text-caption text-lightText font-weight-medium my-2 d-block">
                    #{{ props.data.student_id }}
                  </p>
                  <div class="text-caption">12th - CBSC</div>
                  <p class="text-caption my-2">28 Nov 2025 08:45 PM</p>
                </div>
              </div>
            </div>
          </div>

          <!-- text card -->
          <div v-else-if="con.formatType === $keys.DT_TEXT">
            <div class="text-caption text-medium-emphasis mb-1">
              {{ con.label }}
            </div>
            <div class="text-subtitle-2 text-truncate">
              {{ props.data[con.value] ?? "-" }}
            </div>
          </div>

          <!-- custom slot -->
          <div v-else-if="con.formatType === $keys.DT_CUSTOM">
            <slot :name="con.label" v-bind="{ item: props.data, con }" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss"></style>
