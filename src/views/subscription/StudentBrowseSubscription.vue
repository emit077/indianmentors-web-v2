<script setup lang="ts">
import { ref } from 'vue';
import pageConfig from './config/student_browse_subscription';
import ComponentTitle from '@/components/shared/ComponentTitle.vue';
import { mdiArrowRight, mdiMedal, mdiDiamondStone, mdiCrown, mdiStar, mdiInformationOutline } from '@mdi/js';

const selectedPlan = ref<string | null>(null);

interface ComparisonFeature {
  label: string;
  gold: string;
  diamond: string;
  platinum: string;
}

const comparisonFeatures: ComparisonFeature[] = [
  { label: 'Daily Duration', gold: '1 Hour', diamond: '1.5 Hours', platinum: '2 Hours' },
  { label: 'Best For', gold: 'Primary & Middle School', diamond: 'Middle & High School', platinum: 'High School & Exam Preparation' },
  { label: 'Subjects', gold: '1–4', diamond: '2–5', platinum: 'Multiple / All' },
  { label: 'Learning Focus', gold: 'Homework + Concepts', diamond: 'Practice + Revision', platinum: 'Full Coverage + Exam Prep' },
  { label: 'Progress Updates', gold: 'Monthly', diamond: 'Bi-Weekly', platinum: 'Weekly Detailed' },
  { label: 'Parent Engagement', gold: 'Monthly', diamond: 'Fortnightly', platinum: 'Weekly' },
  { label: 'Tutor Discovery', gold: 'Focused Selection', diamond: 'Expanded / Priority', platinum: 'Expanded + Smart Recommendation' },
  { label: 'Demo Access', gold: 'As Applicable', diamond: 'Priority', platinum: 'Priority' },
  { label: 'Support', gold: 'Standard', diamond: 'Priority', platinum: 'Premium' },
  { label: 'Tutor Support', gold: 'As per Policy', diamond: 'As per Policy', platinum: 'As per Policy' }
];

const plans = [
  {
    id: 'gold',
    name: 'Gold',
    subtitle: 'Affordable academic support for consistent learning.',
    duration: '1 hour',
    audience: 'Primary & Middle School',
    icon: mdiMedal,
    featured: false,
    highlights: ['Homework support', 'Concept clarity', 'Regular academic support'],
    extras: ['1–4 subjects', 'Monthly progress updates', 'Standard support']
  },
  {
    id: 'diamond',
    name: 'Diamond',
    subtitle: 'Our most popular plan for consistent academic improvement.',
    duration: '1.5 hours',
    audience: 'Middle & High School',
    icon: mdiDiamondStone,
    featured: true,
    highlights: ['Deeper learning', 'Practice & revision', 'Problem solving focus'],
    extras: ['2–5 subjects', 'Bi-weekly reports', 'Parent dashboard', 'Priority support']
  },
  {
    id: 'platinum',
    name: 'Platinum',
    subtitle: 'Comprehensive support for high-performance learners.',
    duration: '2 hours',
    audience: 'High School & Exam Preparation',
    icon: mdiCrown,
    featured: false,
    highlights: ['Intensive support', 'Board exam preparation', 'Competitive exam coaching'],
    extras: ['Weekly detailed reporting', 'Smart tutor recommendation', 'Exam-focused preparation']
  }
];

const selectPlan = (planId: string) => {
  selectedPlan.value = planId;
  console.log('Selected Plan:', planId);
};
</script>

<template>
  <ComponentTitle :config="pageConfig.pageHeaderConfig" />
  <div class="plans-section mb-8">

    <v-row align="stretch" dense class="justify-center">
      <v-col v-for="plan in plans" :key="plan.id" cols="12" md="3" class="d-flex">
        <v-card variant="elevated" rounded="lg" :class="plan.featured ? 'plan-card--featured' : 'mt-8'">
          <v-chip v-if="plan.featured" class="best-value-badge" color="warning300" variant="flat" size="small" label>
            <v-icon start size="14" :icon="mdiStar" />
            BEST VALUE
          </v-chip>

          <v-card-text :class="['pa-6', 'd-flex', 'flex-column', 'h-100', { 'text-white': plan.featured }]">
            <div class="d-flex align-center mb-3">
              <v-avatar :color="plan.featured ? 'rgba(255,255,255,0.18)' : 'primary50'" size="40" class="mr-3">
                <v-icon :icon="plan.icon" :color="plan.featured ? 'white' : 'primary'" size="22" />
              </v-avatar>
              <div>
                <h3 class="text-h6 font-weight-bold mb-0" :class="{ 'text-white': plan.featured }">
                  {{ plan.name }}
                </h3>
              </div>
            </div>

            <p class="text-body-2 mb-5" :class="plan.featured ? 'text-white' : 'text-medium-emphasis'"
              :style="plan.featured ? 'opacity: 0.9' : undefined">
              {{ plan.subtitle }}
            </p>

            <div class="mb-5">
              <div class="duration-value font-weight-bold" :class="{ 'text-white': plan.featured }">
                {{ plan.duration }}
              </div>
              <div class="text-body-2" :class="plan.featured ? 'text-white' : 'text-medium-emphasis'"
                :style="plan.featured ? 'opacity: 0.85' : undefined">
                per day
              </div>
              <div class="text-caption mt-1" :class="plan.featured ? 'text-white' : 'text-medium-emphasis'"
                :style="plan.featured ? 'opacity: 0.75' : undefined">
                {{ plan.audience }}
              </div>
            </div>

            <v-list density="compact" bg-color="transparent" class="pa-0 mb-4">
              <v-list-item v-for="(item, idx) in plan.highlights" :key="idx" class="px-0" min-height="32">
                <v-list-item-title class="text-body-2 text-wrap" :class="{ 'text-white': plan.featured }">
                  <v-icon size="18" class="mr-2" :color="plan.featured ? 'white' : 'primary'" :icon="mdiArrowRight" />
                  {{ item }}
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <v-divider class="mb-4" :class="plan.featured ? 'border-opacity-25' : undefined"
              :color="plan.featured ? 'white' : undefined" />

            <div class="text-overline mb-2" :class="plan.featured ? 'text-white' : 'text-medium-emphasis'">
              Additional Features
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <div class="comparison-section mb-4">
    <div class="text-center mb-6">
      <h2 class="text-h5 font-weight-bold mb-2">
        Which Learning Plan Fits
        <span class="text-primary">Your Child?</span>
      </h2>
      <p class="text-body-2 text-medium-emphasis mx-auto section-subtitle">
        Side-by-side details for daily duration, subjects, monitoring, and support.
      </p>
    </div>

    <v-card elevation="2" rounded="lg" class="comparison-card overflow-hidden">
      <div class="comparison-scroll">
        <table class="comparison-table">
          <thead>
            <tr>
              <th class="feature-col">Feature</th>
              <th>
                <div class="plan-header">
                  <span>Gold</span>
                </div>
              </th>
              <th class="featured-col">
                <div class="plan-header">
                  <span>Diamond</span>
                </div>
              </th>
              <th>
                <div class="plan-header">
                  <span>Platinum</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(feature, index) in comparisonFeatures" :key="index">
              <td class="feature-label">{{ feature.label }}</td>
              <td>{{ feature.gold }}</td>
              <td class="featured-col">{{ feature.diamond }}</td>
              <td>{{ feature.platinum }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <v-divider />
      <div class="text-right pa-4">
        <div class=" text-caption text-medium-emphasis ">
          <v-icon size="16" class="mr-1 mt-0" :icon="mdiInformationOutline" />
          <span>*Subject to applicable policy, tutor availability, and service conditions.</span>
        </div>
      </div>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.section-subtitle {
  max-width: 520px;
}

.plan-card {
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &--featured {
    background: rgb(var(--v-theme-primary));
    border-color: rgb(var(--v-theme-primary));
    color: white;
  }
}

.best-value-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: rgb(var(--v-theme-gray900)) !important;
}

.duration-value {
  font-size: 2rem;
  line-height: 1.15;
}

.comparison-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.comparison-scroll {
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 16px;
    text-align: center;
    vertical-align: middle;
    font-size: 0.875rem;
  }

  thead th {
    background: rgb(var(--v-theme-primary));
    color: white;
    font-weight: 600;
  }

  tbody tr:nth-child(even) {
    background: rgba(var(--v-theme-primary), 0.03);
  }

  tbody tr:nth-child(odd) {
    background: rgb(var(--v-theme-surface));
  }

  .feature-col,
  .feature-label {
    text-align: left;
    font-weight: 600;
    width: 22%;
  }

  .feature-label {
    color: rgba(var(--v-theme-on-surface), 0.75);
  }

  tbody .featured-col {
    background: rgba(var(--v-theme-primary), 0.06);
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
  }

  thead .featured-col {
    background: rgb(var(--v-theme-primary));
  }
}

.plan-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.disclaimer {
  max-width: 320px;
  line-height: 1.4;
}
</style>
