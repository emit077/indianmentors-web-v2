import { useAuthStore } from '@/stores/auth';
import $keys from '@/utils/keys';
const authStore = useAuthStore();
const user = authStore.getUser();

const studentProfileConfig: Record<string, any> = {
  /* Admin Profile Config */
  [$keys.ACCOUNT_ADMIN]: {
    pageHeaderConfig: {
      pageTitle: 'Subscription',
      pageDescription: 'Manage and view all student profiles',
      showBackButton: true,
      breadcrumbs: [
        {
          title: 'Home',
          disabled: false,
          to: { name: 'Default' }
        },
        {
          title: 'Subscription',
          disabled: true
          // to: { name: 'StudentList' }
        }
      ]
    },
  },
  /* Student Profile Config */
  [$keys.ACCOUNT_STUDENT]: {
    pageHeaderConfig: {
      pageTitle: 'Subscription',
      pageDescription: 'Manage and view all student profiles',
      showBackButton: true,
      breadcrumbs: [
        {
          title: 'Home',
          disabled: false,
          to: { name: 'Default' }
        },
        {
          title: 'Subscription',
          disabled: true
          // to: { name: 'StudentList' }
        }
      ]
    },
  }
};
const pageConfig = studentProfileConfig[user.account_type];
export default pageConfig;
