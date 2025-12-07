import type { App } from 'vue';
export default {
  install(app: App) {
    // Provide values for Composition API via `inject('keys')` / `inject('messages')`.
    // Note: removed `app.config.globalProperties` assignments to avoid encouraging
    // usage of `this.$keys` / `this.$msg` in Composition API code.

  },
};
