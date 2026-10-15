import { nextTick, ref } from 'vue';

export function useAuthSnackbar() {
  const visible = ref(false);
  const message = ref('');
  const type = ref<'success' | 'error'>('error');

  async function show(text: string, kind: 'success' | 'error') {
    visible.value = false;
    message.value = text;
    type.value = kind;
    await nextTick();
    visible.value = true;
  }

  function showError(text: string) {
    return show(text, 'error');
  }

  function showSuccess(text: string) {
    return show(text, 'success');
  }

  return { visible, message, type, showError, showSuccess };
}
