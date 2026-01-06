import { computed } from 'vue';
import { useDisplay } from 'vuetify';

export const CommonHelpers = {
  // Launch dialpad with phone number
  launchDialpad(mobile: string | number): void {
    if (mobile) {
      // Remove any non-digit characters except + for international numbers
      const cleanNumber = String(mobile).replace(/[^\d+]/g, '');
      window.location.href = `tel:${cleanNumber}`;
    } else {
      console.log('No phone number available for this student');
    }
  },

  /**
   * Reactive composable to check if screen is mobile using Vuetify's display system
   */
  isMobile() {
    const display = useDisplay();
    return computed(() => display.mobile.value);
  },

  isNotMobile() {
    const display = useDisplay();
    return computed(() => !display.mobile.value);
  }
};

export default CommonHelpers;
