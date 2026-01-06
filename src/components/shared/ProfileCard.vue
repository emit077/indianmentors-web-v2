<script setup lang="ts">
import { mdiCheckDecagram } from '@mdi/js';
import $keys from '@/utils/keys';
import type { ProfileCardConfigItem } from '@/configs/student/student_list';
import male from '@/assets/images/gender/male.png';
import female from '@/assets/images/gender/female.png';
const avatarSize = 40;
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
              <v-progress-circular :model-value="data.user.profile_completion_per" :rotate="180" :size="50" :width="5" color="primary">
                <v-avatar :size="avatarSize" color="primary" variant="tonal" class="">
                  <v-img v-if="data.user.gender === 'Male'" :src="male" :alt="data.user.gender" :size="avatarSize" class="mt-1" />
                  <v-img v-else-if="data.user.gender === 'Female'" :src="female" :alt="data.user.gender" :size="avatarSize" class="mt-1" />
                  <span v-else class="text-body-1 font-weight-bold"> -- </span>
                </v-avatar>
              </v-progress-circular>
            </div>
            <p class="text-subtitle-1 font-weight-medium mt-2">70%</p>
          </div>
          <div class="flex-grow-1 pl-4" style="min-width: 0">
            <div class="d-flex align-top">
              <div class="flex-grow-1" style="min-width: 0">
                <div class="d-flex align-center text-subtitle-1">
                  <div class="text-subtitle-1 font-weight-medium text-truncate" style="max-width: 90%">
                    {{ data.user.name }}
                  </div>
                  <v-icon :icon="mdiCheckDecagram" color="success" />
                </div>
                <p class="text-caption text-lightText font-weight-medium my-2 d-block">#{{ data.student_id }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- text card -->
        <div class="" v-else-if="con.formatType == $keys.DT_TEXT">
          <div class="text-caption text-medium-emphasis mb-1">{{ con.label }}</div>
          <div class="text-subtitle-2 text-truncate">{{ data[con.value] || '-' }}</div>
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
