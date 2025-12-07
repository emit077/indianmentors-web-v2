<script setup lang="ts">
import { mdiCheckDecagram } from "@mdi/js";
import $keys from "@/utils/keys";
import type { ProfileCardConfigItem } from "@/configs/student/student_list";

const props = defineProps<{
  config: ProfileCardConfigItem[];
  data: any; // or a typed interface for your student data
}>();
</script>

<template>
  <!-- {{ props.data }} -->
  <v-card flat variant="outlined" class="mt-5 pa-2" style="background-color: white">
    <!-- {{ props.config }} -->
    <v-row class="" no-gutters>
      <v-col class="pa-3" :class="con.className" v-for="(con, i) in props.config" key="i">
        <!-- profile card -->
        <div class="d-flex align-top" v-if="con.formatType == $keys.DT_PROFILE">
          <div class="text-center">
            <div>
              <v-progress-circular
                :model-value="70"
                :rotate="180"
                :size="58"
                :width="5"
                color="primary"
              >
                <v-avatar size="50" color="secondary " variant="flat" class="">
                  <span class="text-body-1 font-weight-bold"> M </span>
                </v-avatar>
              </v-progress-circular>
            </div>
            <p class="text-subtitle-1 font-weight-medium mt-2">70%</p>
          </div>
          <div class="flex-grow-1 pl-4" style="min-width: 0">
            <div class="d-flex align-top">
              <div class="flex-grow-1" style="min-width: 0">
                <div
                  class="text-subtitle-1 font-weight-medium text-truncate"
                  style="width: 150px"
                >
                  {{ data.name }}
                  <v-icon :icon="mdiCheckDecagram" color="success" />
                </div>

                <p class="text-caption text-lightText font-weight-medium my-2 d-block">
                  #{{ data.student_id }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- text card -->
        <div class="" v-else-if="con.formatType == $keys.DT_TEXT">
          <div class="text-caption text-medium-emphasis mb-1">{{ con.label }}</div>
          <div class="text-subtitle-2 text-truncate">{{ data[con.value] || "-" }}</div>
        </div>
        <!-- custome slot -->
        <div class="" v-else-if="con.formatType == $keys.DT_CUSTOM">
          <slot :name="con.label" v-bind="{ item: props.data, con: con }" />
        </div>
        <!--  -->
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss"></style>
