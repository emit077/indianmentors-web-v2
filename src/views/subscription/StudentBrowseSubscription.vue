<script setup lang="ts">
import { ref, computed } from 'vue';
  import pageConfig from './config/student_browse_subscription';
  import ComponentTitle from '@/components/shared/ComponentTitle.vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { mdiCheckCircle } from '@mdi/js';

const selectedPlan = ref<string | null>(null);
const billingCycle = ref<'monthly' | 'quarterly' | 'halfyearly' | 'annual'>('halfyearly');

interface Feature {
  label: string;
  gold: string;
  diamond: string;
  platinum: string;
  icon: string;
}

const features: Feature[] = [
  { label: 'Session Duration', gold: '1 Hour', diamond: '1.5 Hours', platinum: '2 Hours', icon: 'custom-clock' },
  { label: 'Subjects Covered', gold: '1–4 Subjects', diamond: '2–5 Subjects', platinum: 'All Subjects', icon: 'custom-book' },
  { label: 'Focus On', gold: 'Quick homework support', diamond: 'In-depth learning + practice', platinum: 'Full coverage + exam prep', icon: 'custom-target' },
  { label: 'Best For', gold: 'Primary & Middle School', diamond: 'Middle/High School', platinum: 'Board/Competitive Exams', icon: 'custom-star' },
  { label: 'Reports & Feedback', gold: 'Monthly', diamond: 'Bi-weekly', platinum: 'Weekly detailed', icon: 'custom-document-text' },
  { label: 'Tutor Access', gold: 'Browse 3–5 profiles', diamond: 'Unlimited browsing', platinum: 'Unlimited + AI match', icon: 'custom-search-normal' },
  { label: 'Tutor Replacement', gold: 'Limited (up to 3)', diamond: 'Unlimited', platinum: 'Unlimited + 48hr guarantee', icon: 'custom-refresh' },
  { label: 'Support', gold: 'Business hours', diamond: 'Extended hours', platinum: '24/7 Priority', icon: 'custom-chat' },
  { label: 'Discount', gold: 'Up to 5%', diamond: 'Up to 10%', platinum: 'Up to 15%', icon: 'custom-tag' }
];

const plans = [
  {
    id: 'gold',
    name: 'Gold',
    subtitle: 'Perfect for getting started',
    duration: '1 hr/day',
    prices: { monthly: 14400, quarterly: 12000, halfyearly: 9600, annual: 7200 },
    colorClass: 'warning',
    icon: 'custom-crown',
    popular: false,
    description: 'Ideal for primary and middle school students who need structured homework support and foundational learning in core subjects.',
    features: [
      'Get 1 hour of personalized tutoring every day to build strong academic foundations',
      'Access expert guidance for 1-4 core subjects based on your curriculum',
      'Receive monthly progress reports highlighting achievements and growth areas',
      'Browse through 3-5 verified tutor profiles to find the perfect match',
      'Limited tutor replacement options (up to 3) to ensure continuity',
      'Enjoy 1-3 free demo sessions before committing',
      'Get ticket-based support during working hours',
      'Choose between online or offline classes based on convenience',
      'Benefit from up to 5% discount on longer billing cycles'
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond',
    subtitle: 'Most popular choice',
    duration: '1.5 hrs/day',
    prices: { monthly: 21600, quarterly: 18000, halfyearly: 14400, annual: 10800 },
    colorClass: 'info',
    icon: 'custom-diamond',
    popular: true,
    description: 'Perfect for middle and high school students who need comprehensive subject coverage with regular practice and detailed progress tracking.',
    features: [
      'Enjoy 1.5 hours of daily focused learning sessions combining theory and practice',
      'Master 2-5 subjects with in-depth coverage tailored to your goals',
      'Receive bi-weekly detailed progress reports with subject-specific insights',
      'Get unlimited access to browse and connect with expert tutors',
      'Unlimited tutor replacement options ensuring you have the right mentor',
      'Benefit from priority demo session scheduling with fast-track matching',
      'Access extended hours priority support for timely resolution',
      'Track performance with attendance logs, homework updates, and tutor notes',
      'Experience both online and offline learning modes for maximum flexibility',
      'Save up to 10% with quarterly, half-yearly, and annual payment plans'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum',
    subtitle: 'Complete learning solution',
    duration: '2 hrs/day',
    prices: { monthly: 28800, quarterly: 24000, halfyearly: 19200, annual: 14400 },
    colorClass: 'secondary',
    icon: 'custom-shield',
    popular: false,
    description: 'The ultimate choice for serious learners preparing for board exams and competitive tests who demand comprehensive coverage and personalized attention.',
    features: [
      'Immerse in 2 hours of intensive daily learning covering all subjects comprehensively',
      'Get complete syllabus mastery across all subjects with advanced concepts',
      'Receive weekly detailed academic reports with performance analytics and study plans',
      'Access unlimited tutor browsing with AI-powered recommendations',
      'Enjoy unlimited instant tutor replacements with 48-hour guarantee',
      'Get priority demo sessions with dedicated tutor replacement guarantee within 48 hours',
      'Experience 24/7 priority support via WhatsApp and phone for immediate assistance',
      'Benefit from comprehensive performance tracking including strengths/weaknesses mapping',
      'Receive weekly parent review calls with a dedicated manager for strategic planning',
      'Earn achievement certificates recognizing your milestones and accomplishments',
      'Access exclusive add-on discounts for enrichment programs and study materials',
      'Choose flexible monthly, quarterly, half-yearly, or annual payment plans',
      'Learn your way with seamless online and offline class options 7 days a week',
      'Save up to 15% on annual plans making premium education more affordable'
    ]
  }
];

const billingOptions = [
  { value: 'monthly', label: 'Monthly', discount: 0 },
  { value: 'quarterly', label: 'Quarterly', discount: 10 },
  { value: 'halfyearly', label: 'Half-Yearly', discount: 20 },
  { value: 'annual', label: 'Annual', discount: 30 }
];

const selectedPlanDetails = computed(() => plans.find(p => p.id === selectedPlan.value));

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const getPlanPrice = (plan: typeof plans[0]) => plan.prices[billingCycle.value];

const getDiscount = () => billingOptions.find(o => o.value === billingCycle.value)?.discount || 0;

const selectPlan = (planId: string) => {
  selectedPlan.value = planId;
};

const proceedToCheckout = () => {
  console.log('Selected Plan:', selectedPlan.value, 'Billing:', billingCycle.value);
};
</script>

<template>
  <ComponentTitle :config="pageConfig.pageHeaderConfig" />
  
  <!-- Hero with Billing Selector -->
  <v-card class="mb-4 hero-gradient" elevation="0" rounded="lg">
    <v-card-text class="pa-4">
      <v-row align="center" dense>
        <v-col cols="12" md="6" class="text-center text-md-left">
          <h2 class="text-h6 font-weight-bold text-white mb-1">Choose Your Learning Plan</h2>
          <p class="text-body-2 text-white mb-0" style="opacity: 0.9">
            5,000+ students • Expert tutors • Flexible billing
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <v-chip-group
            v-model="billingCycle"
            mandatory
            selected-class="bg-white text-primary"
            class="justify-center justify-md-end"
          >
            <v-chip
              v-for="option in billingOptions"
              :key="option.value"
              :value="option.value"
              variant="outlined"
              color="white"
              rounded="lg"
              size="small"
            >
              {{ option.label }}
              <v-badge
                v-if="option.discount > 0"
                :content="`-${option.discount}%`"
                color="success"
                inline
                class="ml-1"
              />
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Pricing Cards -->
  <v-row class="mb-4 px-2">
    <v-col v-for="(plan, index) in plans" :key="index" cols="4" sm="4" class="py-1 px-1">
      <v-card
        :class="{ 'border-success': selectedPlan === plan.id, 'border-info': plan.popular && selectedPlan !== plan.id }"
        :elevation="selectedPlan === plan.id ? 8 : 2"
        class="pricing-card position-relative text-center"
        rounded="lg"
        @click="selectPlan(plan.id)"
        hover
      >
      <v-chip
              variant="flat"
              color="error"
              rounded="lg"
              size="x-small"
              class="mt-n4"
              v-if="plan.popular"
            >
            <b>Best Seller</b>
              </v-chip>

        <v-card-text class="pa-4 pt-6 text-center">
          <v-avatar :color="`light${plan.colorClass}`" size="56" class="mb-2">
            <SvgSprite name="custom-crown" style="width: 28px; height: 28px" :class="`text-${plan.colorClass}`" />
          </v-avatar>
          
          <h6 class="text-subtitle-1 font-weight-bold mb-1">{{ plan.name }}</h6>
          <p class="text-caption text-medium-emphasis mb-3">{{ plan.duration }}</p>
      
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Selected Plan Details -->
  <v-expand-transition>
    <v-card v-if="selectedPlan && selectedPlanDetails" class="mb-4" elevation="4" rounded="lg">
      <v-card-text class="pa-4">
        <!-- Header -->
        <v-row align="center" dense class="mb-3">
          <v-col cols="auto">
            <v-avatar :color="`light${selectedPlanDetails.colorClass}`" size="48">
              <SvgSprite name="custom-crown" style="width: 24px; height: 24px" :class="`text-${selectedPlanDetails.colorClass}`" />
            </v-avatar>
          </v-col>
          <v-col>
            <div class="text-caption text-medium-emphasis">Selected Plan</div>
            <h6 class="text-subtitle-1 font-weight-bold mb-0">{{ selectedPlanDetails.name }}</h6>
            <p class="text-caption text-medium-emphasis mb-0">
              {{ selectedPlanDetails.duration }} • {{ formatPrice(getPlanPrice(selectedPlanDetails)) }}/{{ billingCycle }}
            </p>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" size="small" variant="flat" rounded="lg" @click="proceedToCheckout">
              Checkout
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-3"></v-divider>

        <!-- Features -->
        <v-list density="compact" bg-color="transparent" class="pa-0 mb-4">
          <v-list-item
            v-for="(feature, idx) in selectedPlanDetails.features"
            :key="idx"
            min-height="auto"
          >
            <template v-slot:prepend>
              <v-icon size="small" color="success" class="mr-n3" :icon="mdiCheckCircle"></v-icon>
            </template>
            <v-list-item-title class="text-wrap text-body-2">
              {{ feature }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-expand-transition>

  <!-- Comparison Table -->
  <v-card elevation="2" rounded="lg" class="mb-4">
    <v-card-text class="pa-4">
      <h6 class="text-subtitle-1 font-weight-bold text-center mb-4">Quick Comparison</h6>

      <!-- Mobile Accordion -->
      <div class="d-md-none">
        <v-expansion-panels variant="accordion" density="compact">
          <v-expansion-panel v-for="(feature, index) in features" :key="index">
            <v-expansion-panel-title class="text-body-2">
              <div class="d-flex align-center">
                <SvgSprite :name="feature.icon" style="width: 16px; height: 16px" class="text-primary mr-2" />
                {{ feature.label }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-item density="compact">
                  <template v-slot:prepend>
                    <v-chip size="x-small" color="warning" variant="flat">Gold</v-chip>
                  </template>
                  <v-list-item-subtitle class="text-caption">{{ feature.gold }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item density="compact">
                  <template v-slot:prepend>
                    <v-chip size="x-small" color="info" variant="flat">Diamond</v-chip>
                  </template>
                  <v-list-item-subtitle class="text-caption">{{ feature.diamond }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item density="compact">
                  <template v-slot:prepend>
                    <v-chip size="x-small" color="secondary" variant="flat">Platinum</v-chip>
                  </template>
                  <v-list-item-subtitle class="text-caption">{{ feature.platinum }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <!-- Desktop Table -->
      <div class="d-none d-md-block">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-body-2 font-weight-bold">Feature</th>
              <th class="text-center text-caption">
                <div class="d-flex flex-column align-center pa-2">
                  <SvgSprite name="custom-crown" style="width: 16px; height: 16px" class="mb-1 text-warning" />
                  <div class="text-warning font-weight-bold">Gold</div>
                </div>
              </th>
              <th class="text-center text-caption bg-lightinfo">
                <div class="d-flex flex-column align-center pa-2">
                  <SvgSprite name="custom-diamond" style="width: 16px; height: 16px" class="mb-1 text-info" />
                  <div class="text-info font-weight-bold">Diamond</div>
                </div>
              </th>
              <th class="text-center text-caption">
                <div class="d-flex flex-column align-center pa-2">
                  <SvgSprite name="custom-shield" style="width: 16px; height: 16px" class="mb-1 text-secondary" />
                  <div class="text-secondary font-weight-bold">Platinum</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(feature, index) in features" :key="index">
              <td class="text-body-2">
                <div class="d-flex align-center">
                  <SvgSprite :name="feature.icon" style="width: 14px; height: 14px" class="text-primary mr-2" />
                  {{ feature.label }}
                </div>
              </td>
              <td class="text-center text-caption">{{ feature.gold }}</td>
              <td class="text-center text-caption bg-lightinfo font-weight-medium">{{ feature.diamond }}</td>
              <td class="text-center text-caption">{{ feature.platinum }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card-text>
  </v-card>

  <!-- Trust Badges -->
  <v-row dense>
    <v-col cols="6" md="3" v-for="(trust, idx) in [
      { icon: 'custom-shield-tick', title: 'Money Back Guarantee', color: 'success' },
      { icon: 'custom-users', title: '5000+ Students', color: 'info' },
      { icon: 'custom-medal-star', title: 'Certified Tutors', color: 'warning' },
      { icon: 'custom-call', title: '24/7 Support', color: 'secondary' }
    ]" :key="idx">
      <v-card class="text-center pa-3" elevation="0" color="surface" rounded="lg">
        <v-avatar :color="`light${trust.color}`" size="40" class="mb-2">
          <SvgSprite :name="trust.icon" style="width: 20px; height: 20px" :class="`text-${trust.color}`" />
        </v-avatar>
        <div class="text-caption font-weight-medium">{{ trust.title }}</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.hero-gradient {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-darkprimary)) 100%);
}

.pricing-card {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.top-badge {
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}
</style>
