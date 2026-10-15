<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';
import { useDisplay } from 'vuetify';
import { useCustomizerStore } from '../../../stores/customizer';
import leftDrawerItems from '@/layouts/config/drawer';

import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import Logo from '../logo/LogoMain.vue';

const customizer = useCustomizerStore();
const { lgAndUp } = useDisplay();
const drawerItems = shallowRef(leftDrawerItems?.drawerItems || []);
const drawerRef = shallowRef<{ $el?: Node } | null>(null);

function drawerElement() {
  const el = drawerRef.value?.$el;
  if (el instanceof HTMLElement && el.classList.contains('leftSidebar')) return el;
  const sibling = el && 'nextElementSibling' in el ? el.nextElementSibling : null;
  if (sibling instanceof HTMLElement && sibling.classList.contains('leftSidebar')) return sibling;
  return document.querySelector<HTMLElement>('.v-navigation-drawer.leftSidebar');
}

// iOS delivers the first tap as hover. Vuetify flips the drawer hover state on
// that event and the click never lands, so a menu item only works on the second tap.
function suppressTouchHover(event: Event) {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  event.stopImmediatePropagation();
}

onMounted(() => {
  const el = drawerElement();
  el?.addEventListener('mouseenter', suppressTouchHover, true);
  el?.addEventListener('mouseleave', suppressTouchHover, true);
});

onBeforeUnmount(() => {
  const el = drawerElement();
  el?.removeEventListener('mouseenter', suppressTouchHover, true);
  el?.removeEventListener('mouseleave', suppressTouchHover, true);
});
</script>

<template>
  <v-navigation-drawer ref="drawerRef" left v-model="customizer.Sidebar_drawer" elevation="0" rail-width="90"
    mobile-breakpoint="lg" width="260" app class="leftSidebar" :rail="customizer.mini_sidebar"
    :expand-on-hover="lgAndUp">
    <!---Logo part -->

    <div class="pa-5">
      <Logo />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <component :is="lgAndUp ? 'PerfectScrollbar' : 'div'" class="scrollnavbar"
      :class="{ 'scrollnavbar--native': !lgAndUp }">
      <v-list aria-busy="true" class="px-2" aria-label="menu list">
        <!---Menu Loop -->
        <template v-for="(item, i) in drawerItems" :key="i">
          <!---Item Sub Header -->
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <!---Item Divider -->
          <v-divider class="my-3" v-else-if="item.divider" />
          <!---If Has Child -->
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
          <!---Single Item-->
          <NavItem :item="item" v-else />
          <!---End Single Item-->
        </template>
      </v-list>
      <div class="pa-4">
        <!-- <ExtraBox /> -->
      </div>
      <div class="justify-center text-center">
        <v-chip size="small" color="primary" variant="tonal"> v1.0.0 (Beta) </v-chip>
      </div>
    </component>
  </v-navigation-drawer>
</template>
