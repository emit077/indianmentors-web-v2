<script setup lang="js">
import getFeatherIcon from "@/utils/feather-icons";
// import keys from "@/utils/keys";

const props = defineProps({
  btn: String,
});
</script>
<template>
  <v-btn x-small>
    <i
      v-if="props.btn"
      :title="props.btn.title"
      :style="{ '--btn-color': 'var(' + props.btn.color + ')' }"
      class="table-btn"
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
    color: #fff;
  }
}
</style>
