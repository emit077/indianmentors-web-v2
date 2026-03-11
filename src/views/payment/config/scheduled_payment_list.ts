import $keys from '@/utils/keys';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const user = authStore.getUser();

const scheduledPaymentListConfig: Record<string, any> = {
  [$keys.ACCOUNT_ADMIN]: {
    pageHeaderConfig: {
      pageTitle: 'Scheduled Payments',
      pageDescription: 'View and manage EMI and scheduled payment plans',
      showBackButton: true,
      breadcrumbs: [
        { title: 'Home', disabled: false, to: { name: 'Default' } },
        { title: 'Payments', disabled: true },
        { title: 'Scheduled Payments', disabled: true }
      ]
    },
    dataTableConfig: {
      headers: [
        { title: 'Plan ID', key: 'plan_id', minWidth: '100px', sortable: false },
        { title: 'Payer', key: 'user', minWidth: '140px', align: 'start', formatType: $keys.DT_PROFILE, sortable: false },
        { title: 'Amount', key: 'amount', minWidth: '100px', formatType: $keys.DT_CUSTOM, sortable: false },
        { title: 'Due Date', key: 'due_date', sortable: false },
        { title: 'Installment', key: 'installment', sortable: false },
        { title: 'Status', key: 'status', formatType: $keys.DT_CUSTOM, sortable: false },
        { title: 'Actions', key: 'DT_BTNS', align: 'end', formatType: $keys.DT_CUSTOM, sortable: false }
      ]
    },
    profileCardConfig: [
      { formatType: $keys.DT_PROFILE, label: '', value: 'profile_card', className: 'mb-v-col-md-12 v-col-12' },
      { formatType: $keys.DT_TEXT, label: 'Amount', value: 'amount', className: 'mb-v-col-md-6 v-col-6' },
      { formatType: $keys.DT_TEXT, label: 'Due Date', value: 'due_date', className: 'mb-v-col-md-6 v-col-6' },
      { formatType: $keys.DT_TEXT, label: 'Installment', value: 'installment', className: 'mb-v-col-md-6 v-col-6' },
      { formatType: $keys.DT_TEXT, label: 'Status', value: 'status', className: 'mb-v-col-md-6 v-col-6' },
      { formatType: $keys.DT_CUSTOM, label: 'actionBtn', value: '', className: 'mb-v-col-md-12 v-col-12' }
    ],
    profileListConfig: [
      { className: 'mb-v-col-md-4 v-col-4', childs: [{ formatType: $keys.DT_PROFILE, label: '', value: 'profile_card', className: '' }] },
      { className: 'mb-v-col-md-3 v-col-3', childs: [{ formatType: $keys.DT_TEXT, label: 'Amount', value: 'amount', className: '' }, { formatType: $keys.DT_TEXT, label: 'Due Date', value: 'due_date', className: '' }] },
      { className: 'mb-v-col-md-3 v-col-3', childs: [{ formatType: $keys.DT_TEXT, label: 'Installment', value: 'installment', className: '' }, { formatType: $keys.DT_TEXT, label: 'Status', value: 'status', className: '' }] },
      { className: 'mb-v-col-md-2 v-col-2', childs: [{ formatType: $keys.DT_CUSTOM, label: 'actionBtn', value: '', className: '' }] }
    ]
  },
  [$keys.ACCOUNT_STUDENT]: {
    pageHeaderConfig: {
      pageTitle: 'Scheduled Payments',
      pageDescription: 'View your EMI and upcoming payment schedule',
      showBackButton: true,
      breadcrumbs: [
        { title: 'Home', disabled: false, to: { name: 'Default' } },
        { title: 'Transactions', disabled: false, to: '/dashboard/payments/transactions' },
        { title: 'Scheduled Payments', disabled: true }
      ]
    },
    dataTableConfig: {
      headers: [
        { title: 'Plan ID', key: 'plan_id', minWidth: '100px', sortable: false },
        { title: 'Recipient', key: 'user', minWidth: '140px', align: 'start', formatType: $keys.DT_PROFILE, sortable: false },
        { title: 'Amount', key: 'amount', minWidth: '100px', formatType: $keys.DT_CUSTOM, sortable: false },
        { title: 'Due Date', key: 'due_date', sortable: false },
        { title: 'Installment', key: 'installment', sortable: false },
        { title: 'Status', key: 'status', formatType: $keys.DT_CUSTOM, sortable: false },
        { title: 'Actions', key: 'DT_BTNS', align: 'end', formatType: $keys.DT_CUSTOM, sortable: false }
      ]
    },
    profileCardConfig: [
      { formatType: $keys.DT_PROFILE, label: '', value: 'profile_card', className: 'mb-v-col-md-12 v-col-12' },
      { formatType: $keys.DT_TEXT, label: 'Amount', value: 'amount', className: 'mb-v-col-md-6 v-col-6' },
      { formatType: $keys.DT_TEXT, label: 'Due Date', value: 'due_date', className: 'mb-v-col-md-6 v-col-6' },
      { formatType: $keys.DT_TEXT, label: 'Installment', value: 'installment', className: 'mb-v-col-md-6 v-col-6' },
      { formatType: $keys.DT_TEXT, label: 'Status', value: 'status', className: 'mb-v-col-md-6 v-col-6' },
      { formatType: $keys.DT_CUSTOM, label: 'actionBtn', value: '', className: 'mb-v-col-md-12 v-col-12' }
    ],
    profileListConfig: [
      { className: 'mb-v-col-md-4 v-col-4', childs: [{ formatType: $keys.DT_PROFILE, label: '', value: 'profile_card', className: '' }] },
      { className: 'mb-v-col-md-3 v-col-3', childs: [{ formatType: $keys.DT_TEXT, label: 'Amount', value: 'amount', className: '' }, { formatType: $keys.DT_TEXT, label: 'Due Date', value: 'due_date', className: '' }] },
      { className: 'mb-v-col-md-3 v-col-3', childs: [{ formatType: $keys.DT_TEXT, label: 'Installment', value: 'installment', className: '' }, { formatType: $keys.DT_TEXT, label: 'Status', value: 'status', className: '' }] },
      { className: 'mb-v-col-md-2 v-col-2', childs: [{ formatType: $keys.DT_CUSTOM, label: 'actionBtn', value: '', className: '' }] }
    ]
  }
};

const pageConfig = scheduledPaymentListConfig[user.account_type] ?? scheduledPaymentListConfig[$keys.ACCOUNT_ADMIN];
export default pageConfig;
