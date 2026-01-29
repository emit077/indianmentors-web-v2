<script setup lang="ts">
import { computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const props = defineProps<{
  modelValue: boolean;
  data: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', data: any): void;
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const careerAspirations = [
  { icon: '🩺', label: 'Doctor' },
  { icon: '🛠️', label: 'Engineer' },
  { icon: '⚖️', label: 'Lawyer' },
  { icon: '📊', label: 'Chartered Accountant' },
  { icon: '🏛️', label: 'Govt Services' },
  { icon: '👩‍🏫', label: 'Teacher/Researcher' },
  { icon: '🔬', label: 'Scientist' },
  { icon: '🎖️', label: 'Armed Forces' },
  { icon: '🏗️', label: 'Architect' },
  { icon: '🎨', label: 'Artist' },
  { icon: '💼', label: 'Entrepreneur' },
  { icon: '💻', label: 'IT Professional' },
  { icon: '✈️', label: 'Pilot' },
  { icon: '⚽', label: 'Sports' },
  { icon: '📰', label: 'Journalist' },
  { icon: '🌍', label: 'Social Worker' },
  { icon: '✍️', label: 'Other' }
];

const hobbies = [
  { icon: '📚', label: 'Reading' },
  { icon: '⚽', label: 'Sports' },
  { icon: '🎶', label: 'Music' },
  { icon: '💃', label: 'Dance' },
  { icon: '🎨', label: 'Drawing/Arts' },
  { icon: '🤖', label: 'Coding/Robotics' },
  { icon: '🎤', label: 'Public Speaking' },
  { icon: '🌍', label: 'Volunteering' },
  { icon: '✍️', label: 'Other' }
];

const schema = yup.object({
  classMode: yup.string().required('Mode of Class is required'),
  batchType: yup.string().required('Batch Type is required'),
  budgetRange: yup.string().required('Budget Range is required'),
  planToHire: yup.string().required('Plan to Hire is required')
});

const { handleSubmit, defineField, errors, values, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    classMode: props.data?.classMode || '',
    batchType: props.data?.batchType || '',
    budgetRange: props.data?.budgetRange || '',
    planToHire: props.data?.planToHire || '',
    careerAspirations: props.data?.careerAspirations || [],
    weekPreference: props.data?.weekPreference || [],
    daysPreference: props.data?.daysPreference || [],
    timeSlots: props.data?.timeSlots || [],
    sessionDuration: props.data?.sessionDuration || '',
    hobbies: props.data?.hobbies || [],
    specialConcernsTutoring: props.data?.specialConcernsTutoring || [],
    specialServices: props.data?.specialServices || [],
    backupTutor: props.data?.backupTutor || false,
    trialSession: props.data?.trialSession || false,
    subscriptionPlan: props.data?.subscriptionPlan || ''
  }
});

const [classMode] = defineField('classMode');
const [batchType] = defineField('batchType');
const [budgetRange] = defineField('budgetRange');
const [planToHire] = defineField('planToHire');

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.data) {
    setValues({
      classMode: props.data.classMode || '',
      batchType: props.data.batchType || '',
      budgetRange: props.data.budgetRange || '',
      planToHire: props.data.planToHire || '',
      careerAspirations: props.data.careerAspirations || [],
      weekPreference: props.data.weekPreference || [],
      daysPreference: props.data.daysPreference || [],
      timeSlots: props.data.timeSlots || [],
      sessionDuration: props.data.sessionDuration || '',
      hobbies: props.data.hobbies || [],
      specialConcernsTutoring: props.data.specialConcernsTutoring || [],
      specialServices: props.data.specialServices || [],
      backupTutor: props.data.backupTutor || false,
      trialSession: props.data.trialSession || false,
      subscriptionPlan: props.data.subscriptionPlan || ''
    });
  }
});

watch(() => props.data, (newData) => {
  if (props.modelValue && newData) {
    setValues({
      classMode: newData.classMode || '',
      batchType: newData.batchType || '',
      budgetRange: newData.budgetRange || '',
      planToHire: newData.planToHire || '',
      careerAspirations: newData.careerAspirations || [],
      weekPreference: newData.weekPreference || [],
      daysPreference: newData.daysPreference || [],
      timeSlots: newData.timeSlots || [],
      sessionDuration: newData.sessionDuration || '',
      hobbies: newData.hobbies || [],
      specialConcernsTutoring: newData.specialConcernsTutoring || [],
      specialServices: newData.specialServices || [],
      backupTutor: newData.backupTutor || false,
      trialSession: newData.trialSession || false,
      subscriptionPlan: newData.subscriptionPlan || ''
    });
  }
}, { deep: true });

const onSubmit = handleSubmit((formValues) => {
  emit('save', formValues);
  dialog.value = false;
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="1000px" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Edit Tutoring Service Preferences</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="classMode"
                :items="['Online', 'Offline (Student\'s Home)', 'Offline (Tutor\'s Place)', 'Offline (Tuition Center)', 'Offline (Coaching Center)', 'Hybrid']"
                label="Mode of Class *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.classMode"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="batchType"
                :items="['One-on-One (Individual)', 'Group Tuition (2–5 students)', 'Small Batch (6–15 students)', 'Large Batch/Coaching']"
                label="Batch Type *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.batchType"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="mb-2">Career Aspirations (Multi-select)</v-label>
              <v-chip-group v-model="values.careerAspirations" multiple>
                <v-chip
                  v-for="career in careerAspirations"
                  :key="career.label"
                  :value="career.label"
                  filter
                >
                  {{ career.icon }} {{ career.label }}
                </v-chip>
              </v-chip-group>
            </v-col>
            <v-col cols="12">
              <v-label class="mb-2">Schedule Preferences</v-label>
              <v-row>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="values.weekPreference"
                    :items="['Weekdays', 'Weekends', 'Both']"
                    label="Week Preference"
                    variant="outlined"
                    density="comfortable"
                    multiple
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="values.daysPreference"
                    :items="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
                    label="Days Preference"
                    variant="outlined"
                    density="comfortable"
                    multiple
                    chips
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="values.timeSlots"
                    :items="['Morning', 'Afternoon', 'Evening', 'Night', 'Midnight', 'Custom']"
                    label="Time Slots"
                    variant="outlined"
                    density="comfortable"
                    multiple
                    chips
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.sessionDuration"
                :items="['1 hr', '1.5 hrs', '2 hrs', 'Other']"
                label="Session Duration"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="budgetRange"
                :items="['₹3K–₹5K', '₹5K–₹10K', '₹10K–₹15K', '₹15K–₹20K', '₹20K+', 'Custom']"
                label="Budget Range (Per Month) *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.budgetRange"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="planToHire"
                :items="['Immediately', 'Within a Week', 'Within a Month', 'In Next Academic Session']"
                label="Plan to Hire a Tutor *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.planToHire"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="mb-2">Hobbies/Interests</v-label>
              <v-chip-group v-model="values.hobbies" multiple>
                <v-chip
                  v-for="hobby in hobbies"
                  :key="hobby.label"
                  :value="hobby.label"
                  filter
                >
                  {{ hobby.icon }} {{ hobby.label }}
                </v-chip>
              </v-chip-group>
            </v-col>
            <v-col cols="12">
              <v-label class="mb-2">Special Concerns</v-label>
              <div class="d-flex flex-column">
                <v-checkbox v-model="values.specialConcernsTutoring" label="Learning Difficulty" value="learning" hide-details />
                <v-checkbox v-model="values.specialConcernsTutoring" label="Attention Issues" value="attention" hide-details />
                <v-checkbox v-model="values.specialConcernsTutoring" label="Language Barrier" value="language" hide-details />
                <v-checkbox v-model="values.specialConcernsTutoring" label="Confidence" value="confidence" hide-details />
                <v-checkbox v-model="values.specialConcernsTutoring" label="Exam Support" value="exam" hide-details />
                <v-checkbox v-model="values.specialConcernsTutoring" label="Behavioural Concerns" value="behavioural" hide-details />
                <v-checkbox v-model="values.specialConcernsTutoring" label="Health/Medical" value="health" hide-details />
                <v-checkbox v-model="values.specialConcernsTutoring" label="Other" value="other" hide-details />
              </div>
            </v-col>
            <v-col cols="12">
              <v-label class="mb-2">Special Personalised Tutoring Service Requirements</v-label>
              <div class="d-flex flex-column">
                <v-checkbox v-model="values.specialServices" label="Shadow Tutor (accompanies child in school/coaching)" value="shadow" hide-details />
                <v-checkbox v-model="values.specialServices" label="Live-in Family Tutor" value="livein" hide-details />
                <v-checkbox v-model="values.specialServices" label="Travel Tutor" value="travel" hide-details />
                <v-checkbox v-model="values.specialServices" label="Home Schooling" value="homeschool" hide-details />
                <v-checkbox v-model="values.specialServices" label="Inclusive Learning" value="inclusive" hide-details />
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <v-switch
                v-model="values.backupTutor"
                label="Backup Tutor Preference"
                color="primary"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch
                v-model="values.trialSession"
                label="Trial/Demo Session Required"
                color="primary"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="values.subscriptionPlan"
                :items="['Gold', 'Diamond', 'Platinum']"
                label="Subscription Plan Interest"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="onSubmit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
