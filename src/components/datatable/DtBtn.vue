<script setup lang="js">
import { RouterLink } from 'vue-router';
import getFeatherIcon from '@/utils/feather-icons';
// import keys from "@/utils/keys";

const props = defineProps({
  btn: String,
  to: [String, Object]
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  // If 'to' prop is provided, let router-link handle navigation
  // Otherwise, emit click event
  if (!props.to) {
    event.preventDefault();
    emit('click');
  }
};
</script>
<template>
  <RouterLink v-if="to" :to="to" style="text-decoration: none; display: inline-block">
    <v-btn size="small" color="primary" variant="tonal" icon @click="handleClick">
      <i
        v-if="props.btn"
        :title="props.btn.title"
        :style="{ '--btn-color': 'var(' + props.btn.color + ')' }"
        class="table-btn pa-1"
        v-html="getFeatherIcon(props.btn.icon)"
      ></i>
    </v-btn>
  </RouterLink>
  <v-btn v-else size="small" color="primary" variant="tonal" icon @click="emit('click')">
    <i
      v-if="props.btn"
      :title="props.btn.title"
      :style="{ '--btn-color': 'var(' + props.btn.color + ')' }"
      class="table-btn pa-1"
      v-html="getFeatherIcon(props.btn.icon)"
    ></i>
  </v-btn>
</template>
<style lang="scss" scoped>
.table-btn {
  height: 27px;
  width: 27px;
  border-radius: 8px;
  margin: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: rgb(var(--btn-color), 0.2);
  .feather {
    height: 15px !important;
    width: 15px !important;
    color: rgb(var(--btn-color), 1);
  }
}
.table-btn:hover {
  background-color: rgb(var(--btn-color), 1);
  .feather {
    color: rgb(var(--v-theme-white));
  }
}
</style>
