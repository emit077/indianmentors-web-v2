// Removed global `this.$keys` / `this.$msg` typings because the plugin no longer
// attaches these to `app.config.globalProperties`. Use one of the following:
// - Direct import: `import KEYS from '@/utils/keys'`
// - Composition API inject: `const keys = inject('keys') as typeof import('@/utils/keys').KEYS`

export {};
