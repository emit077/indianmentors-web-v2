<script setup lang="ts">
import { ref, computed } from 'vue';
import pageConfig from './config/student_browse_subscription';
import ComponentTitle from '@/components/shared/ComponentTitle.vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';

const selectedPlan = ref<string | null>(null);
const billingCycle = ref<'monthly' | 'quarterly' | 'halfyearly' | 'annual'>('halfyearly');
const showComparison = ref(false);

interface Feature {
  label: string;
  gold: string;
  diamond: string;
  platinum: string;
  icon: string;
}

const features: Feature[] = [
  {
    label: 'Session Duration',
    gold: '1 Hour',
    diamond: '1.5 Hours',
    platinum: '2 Hours',
    icon: 'custom-clock'
  },
  {
    label: 'Subjects Covered',
    gold: '1–4 Subjects',
    diamond: '2–5 Subjects',
    platinum: 'All Subjects',
    icon: 'custom-book'
  },
  {
    label: 'Focus On',
    gold: 'Quick subject coverage & homework support',
    diamond: 'In-depth subject learning + practice',
    platinum: 'Comprehensive coverage + exam prep + skill enhancement',
    icon: 'custom-target'
  },
  {
    label: 'Tutor Interaction',
    gold: 'Limited but consistent',
    diamond: 'Moderate depth with Q&A',
    platinum: 'High engagement & mentoring',
    icon: 'custom-users'
  },
  {
    label: 'Best For',
    gold: 'Primary & middle school students',
    diamond: 'Middle/High school, revision + practice',
    platinum: 'High School/Board/Competitive Exams + Full syllabus',
    icon: 'custom-star'
  },
  {
    label: 'Learning Outcomes',
    gold: 'Balanced Learning',
    diamond: 'Exam Preparation, problem-solving',
    platinum: 'Full Coverage, Mastery, revision, test report',
    icon: 'custom-graph'
  },
  {
    label: 'Reports & Feedback',
    gold: 'Monthly basic feedback',
    diamond: 'Bi-weekly subject-specific feedback',
    platinum: 'Weekly detailed academic reports',
    icon: 'custom-document-text'
  },
  {
    label: 'Performance Tracking',
    gold: 'Attendance + homework updates',
    diamond: 'Attendance + progress + tutor notes',
    platinum: 'Attendance, analytics, strengths/weaknesses',
    icon: 'custom-status-up'
  },
  {
    label: 'Parent Engagement',
    gold: 'Monthly parent updates',
    diamond: 'Fortnightly parent call',
    platinum: 'Weekly review + feedback call + dedicated manager',
    icon: 'custom-call'
  },
  {
    label: 'Tutor Access',
    gold: 'Browse 3–5 tutor profiles',
    diamond: 'Unlimited tutor browsing',
    platinum: 'Unlimited browsing + AI tutor recommendation',
    icon: 'custom-search-normal'
  },
  {
    label: 'Tutor Replacement',
    gold: 'Limited upto 3',
    diamond: 'Unlimited',
    platinum: 'Unlimited until satisfaction',
    icon: 'custom-refresh'
  },
  {
    label: 'Demo Sessions',
    gold: '1-3 Free Demo',
    diamond: 'Priority Demo Scheduling',
    platinum: 'Priority Demo + Tutor Replacement Guarantee (48 hrs)',
    icon: 'custom-play'
  },
  {
    label: 'Support',
    gold: 'Ticket-based support (working hours)',
    diamond: 'Priority support (extended hours)',
    platinum: '24/7 Priority Support (WhatsApp + Phone)',
    icon: 'custom-chat'
  },
  {
    label: 'Payment Options',
    gold: 'Half-Yearly / Annual',
    diamond: 'Quarterly / Half-Yearly / Annual',
    platinum: 'Monthly / Quarterly / Half-Yearly / Annual',
    icon: 'custom-inr-square'
  },
  {
    label: 'Online/Offline Option',
    gold: 'Both',
    diamond: 'Both',
    platinum: 'Both',
    icon: 'custom-monitor'
  },
  {
    label: 'Discount Available',
    gold: 'Upto 5%',
    diamond: 'Upto 10%',
    platinum: 'Upto 15%',
    icon: 'custom-tag'
  }
];

const plans = [
  {
    id: 'gold',
    name: 'Gold Plan',
    subtitle: 'Perfect for getting started',
    duration: '1 hr/day',
    basePrice: 7200,
    prices: {
      monthly: 14400,
      quarterly: 12000,
      halfyearly: 9600,
      annual: 7200
    },
    colorClass: 'warning',
    icon: 'custom-crown',
    popular: false,
    tag: 'BUDGET FRIENDLY',
    features: [
      'Affordable short sessions',
      'Consistent updates',
      'Cost-effective learning',
      'Monthly feedback reports',
      '3-5 Tutor profiles to browse'
    ],
    highlights: [
      { icon: 'custom-clock', text: '1 Hour per day' },
      { icon: 'custom-book', text: '1-4 Subjects' },
      { icon: 'custom-users', text: 'Limited tutor interaction' }
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond Plan',
    subtitle: 'Most popular choice',
    duration: '1.5 hrs/day',
    basePrice: 10800,
    prices: {
      monthly: 21600,
      quarterly: 18000,
      halfyearly: 14400,
      annual: 10800
    },
    colorClass: 'info',
    icon: 'custom-diamond',
    popular: true,
    tag: 'BEST VALUE',
    features: [
      'Balance of cost vs depth',
      'Better progress tracking',
      'Good value for money',
      'Bi-weekly feedback',
      'Unlimited tutor browsing'
    ],
    highlights: [
      { icon: 'custom-clock', text: '1.5 Hours per day' },
      { icon: 'custom-book', text: '2-5 Subjects' },
      { icon: 'custom-users', text: 'Moderate tutor interaction' }
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum Plan',
    subtitle: 'Complete learning solution',
    duration: '2 hrs/day',
    basePrice: 14400,
    prices: {
      monthly: 28800,
      quarterly: 24000,
      halfyearly: 19200,
      annual: 14400
    },
    colorClass: 'secondary',
    icon: 'custom-shield',
    popular: false,
    tag: 'PREMIUM',
    features: [
      'Maximum learning value',
      'Detailed progress tracking',
      'Achievement Certificates',
      'Add-on discounts',
      'Weekly detailed reports',
      '24/7 Priority Support'
    ],
    highlights: [
      { icon: 'custom-clock', text: '2 Hours per day' },
      { icon: 'custom-book', text: 'All Subjects' },
      { icon: 'custom-users', text: 'High engagement & mentoring' }
    ]
  }
];

const billingOptions = [
  { value: 'monthly', label: 'Monthly', discount: 0 },
  { value: 'quarterly', label: 'Quarterly', discount: 10 },
  { value: 'halfyearly', label: 'Half-Yearly', discount: 20 },
  { value: 'annual', label: 'Annual', discount: 30 }
];

const selectedPlanDetails = computed(() => {
  return plans.find(p => p.id === selectedPlan.value);
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const getPlanPrice = (plan: typeof plans[0]) => {
  return plan.prices[billingCycle.value];
};

const getDiscount = (plan: typeof plans[0]) => {
  const option = billingOptions.find(o => o.value === billingCycle.value);
  return option?.discount || 0;
};

const selectPlan = (planId: string) => {
  selectedPlan.value = planId;
};

const proceedToCheckout = () => {
  console.log('Selected Plan:', selectedPlan.value);
  // Add your checkout logic here
};
</script>
<!-- <script setup lang="ts">
  import { ref } from 'vue';
  import CommonHelpers from '@/utils/helpers/helper-functions';
  import { mdiTableLarge, mdiListBoxOutline, mdiAccountBoxOutline } from '@mdi/js';
  
  const isMobileScreen = CommonHelpers.isMobile();
  const currentTab = ref<string>(isMobileScreen.value ? 'card' : 'table');
  
  const btnConfig = [
    {
      icon: mdiTableLarge,
      value: 'table'
    },
    {
      icon: mdiListBoxOutline,
      value: 'list'
    },
    {
      icon: mdiAccountBoxOutline,
      value: 'card'
    }
  ];
  </script> 
  <template>

  
    <v-tabs-window v-model="currentTab">
      <v-tabs-window-item v-for="btn in btnConfig" :value="btn.value" :key="btn.value">
        <slot :name="`${btn.value}`"></slot>
      </v-tabs-window-item>
    </v-tabs-window>
  </template>-->
  

<template>
  <ComponentTitle :config="pageConfig.pageHeaderConfig" />
  
  <!-- Pricing Cards -->
  <v-row class="mb-8">
    <v-col v-for="(plan, index) in plans" :key="index" cols="4" md="4" class="px-2 py-1">
      <v-card class="text-center pa-1 pt-4">
        <v-avatar size="60" class="mb-3" color="gold" variant="tonal">
          <SvgSprite name="custom-crown" style="width: 30px; height: 30px" class="text-primary" />
        </v-avatar>
            <h3 class="text-h6 font-weight-bold mb-1">{{ plan.name }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">{{ plan.duration }}</p>
      </v-card>
    </v-col>
  </v-row>

  <!-- Detailed Comparison -->
  <v-card class="mb-6" elevation="2" rounded="lg">
    <v-card-text class="px-0">
      <h3 class="text-h5 font-weight-bold mb-6 text-center">Detailed Feature Comparison</h3>

      <!-- Mobile View - Accordion -->
      <div class="d-md-none">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="(feature, index) in features" :key="index">
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <SvgSprite :name="feature.icon" style="width: 20px; height: 20px" class="text-primary mr-3" />
                <span class="text-body-2 font-weight-medium">{{ feature.label }}</span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="text-caption font-weight-bold mb-1">
                    <v-chip size="x-small" color="warning" variant="flat" class="mr-2">Gold</v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ feature.gold }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption font-weight-bold mb-1">
                    <v-chip size="x-small" color="info" variant="flat" class="mr-2">Diamond</v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ feature.diamond }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption font-weight-bold mb-1">
                    <v-chip size="x-small" color="secondary" variant="flat" class="mr-2">Platinum</v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ feature.platinum }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <!-- Desktop View - Table -->
      <div class="d-none d-md-block">
        <v-table class="comparison-table">
          <thead>
            <tr>
              <th class="text-left font-weight-bold">Feature</th>
              <th class="text-center font-weight-bold text-warning">
                <div class="d-flex flex-column align-center">
                  <div>Gold Plan</div>
                  <div class="text-caption font-weight-regular text-medium-emphasis">1 hr/day</div>
                </div>
              </th>
              <th class="text-center font-weight-bold text-info">
                <div class="d-flex flex-column align-center">
                  <div>Diamond Plan</div>
                  <div class="text-caption font-weight-regular text-medium-emphasis">1.5 hrs/day</div>
                </div>
              </th>
              <th class="text-center font-weight-bold text-secondary">
                <div class="d-flex flex-column align-center">
                  <div>Platinum Plan</div>
                  <div class="text-caption font-weight-regular text-medium-emphasis">2 hrs/day</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(feature, index) in features" :key="index">
              <td class="feature-cell text-body-2 font-weight-medium"> # {{ feature.label }}</td>
              <td class="text-center text-body-2">{{ feature.gold }}</td>
              <td class="text-center text-body-2">{{ feature.diamond }}</td>
              <td class="text-center text-body-2">{{ feature.platinum }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card-text>
  </v-card>

  <!-- CTA Section -->
  <v-card v-if="selectedPlan" class="cta-card mb-6" elevation="4" rounded="lg" color="lightprimary">
    <v-card-text class="pa-6 text-center">
      <SvgSprite name="custom-tick-circle" style="width: 48px; height: 48px" class="text-success mb-3" />
      <h4 class="text-h6 font-weight-bold mb-2">Great Choice!</h4>
      <p class="text-body-2 text-medium-emphasis mb-4">
        You've selected the <strong>{{ plans.find(p => p.id === selectedPlan)?.name }}</strong>
      </p>
      <v-btn color="primary" size="large" variant="flat" rounded="sm" @click="proceedToCheckout">
        <SvgSprite name="custom-arrow-right" style="width: 18px; height: 18px" class="mr-2" />
        Proceed to Checkout
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
// Hero Card
.hero-card {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-darkprimary)) 100%);
  color: rgb(var(--v-theme-white));
  border: 1px solid rgb(var(--v-theme-borderLight));
}

// Pricing Cards
.pricing-card {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid rgb(var(--v-theme-borderLight));
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
}

.popular-card {
  border-color: rgb(var(--v-theme-info));
  background: rgb(var(--v-theme-lightinfo));
}

.selected-card {
  border-color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-lightprimary));
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.plan-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: transform 0.3s ease;
}

.pricing-card:hover .plan-icon-wrapper {
  transform: scale(1.1);
}

.price-wrapper {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-borderLight));
  border-radius: 8px;
}

.features-list {
  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
}

// Comparison Table
.comparison-table {
  border-radius: 8px;
  overflow: hidden;

  thead {
    background: rgb(var(--v-theme-surface));
    
    th {
      padding: 20px 16px !important;
      border-bottom: 2px solid rgb(var(--v-theme-borderLight)) !important;
      font-weight: 700 !important;
    }
  }

  tbody {
    tr {
      transition: background-color 0.2s ease;

      &:hover {
        background: rgb(var(--v-theme-surface));
      }
      
      td {
        padding: 16px !important;
        border-bottom: 1px solid rgb(var(--v-theme-borderLight)) !important;
      }
    }
  }

  .feature-cell {
    background: rgb(var(--v-theme-surface));
    font-weight: 600;
  }
}

// CTA Card
.cta-card {
  border: 1px solid rgb(var(--v-theme-primary));
}

// Responsive
@media (max-width: 960px) {
  .pricing-card {
    margin-bottom: 16px;
  }
  
  .plan-icon-wrapper {
    width: 70px;
    height: 70px;
  }
}

// Animation
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pricing-card,
.hero-card {
  animation: fadeInUp 0.5s ease-out;
}
</style>