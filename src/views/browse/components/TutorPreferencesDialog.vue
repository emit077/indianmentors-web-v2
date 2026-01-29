<script setup lang="ts">
import { computed, watch } from 'vue';
import { useForm } from 'vee-validate';

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

const { handleSubmit, values, resetForm, setValues } = useForm({
  initialValues: {
    genderPreference: props.data?.genderPreference || '',
    religionPreference: props.data?.religionPreference || '',
    agePreference: props.data?.agePreference || '',
    tutorTypePreference: props.data?.tutorTypePreference || '',
    qualificationPreference: props.data?.qualificationPreference || '',
    experiencePreference: props.data?.experiencePreference || '',
    languagePreference: props.data?.languagePreference || '',
    teachingStylePreference: props.data?.teachingStylePreference || '',
    backgroundVerification: props.data?.backgroundVerification || false,
    qualificationVerification: props.data?.qualificationVerification || false,
    experienceVerification: props.data?.experienceVerification || false,
    backupTutorPreference: props.data?.backupTutorPreference || false
  }
});

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.data) {
    setValues({
      genderPreference: props.data.genderPreference || '',
      religionPreference: props.data.religionPreference || '',
      agePreference: props.data.agePreference || '',
      tutorTypePreference: props.data.tutorTypePreference || '',
      qualificationPreference: props.data.qualificationPreference || '',
      experiencePreference: props.data.experiencePreference || '',
      languagePreference: props.data.languagePreference || '',
      teachingStylePreference: props.data.teachingStylePreference || '',
      backgroundVerification: props.data.backgroundVerification || false,
      qualificationVerification: props.data.qualificationVerification || false,
      experienceVerification: props.data.experienceVerification || false,
      backupTutorPreference: props.data.backupTutorPreference || false
    });
  }
});

watch(() => props.data, (newData) => {
  if (props.modelValue && newData) {
    setValues({
      genderPreference: newData.genderPreference || '',
      religionPreference: newData.religionPreference || '',
      agePreference: newData.agePreference || '',
      tutorTypePreference: newData.tutorTypePreference || '',
      qualificationPreference: newData.qualificationPreference || '',
      experiencePreference: newData.experiencePreference || '',
      languagePreference: newData.languagePreference || '',
      teachingStylePreference: newData.teachingStylePreference || '',
      backgroundVerification: newData.backgroundVerification || false,
      qualificationVerification: newData.qualificationVerification || false,
      experienceVerification: newData.experienceVerification || false,
      backupTutorPreference: newData.backupTutorPreference || false
    });
  }
}, { deep: true });

const onSubmit = handleSubmit((formValues) => {
  emit('save', formValues);
  dialog.value = false;
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="900px" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Edit Tutor Preference Details</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.genderPreference"
                :items="['Male', 'Female', 'No Preference']"
                label="Gender Preference"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.religionPreference"
                :items="['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'No Preference']"
                label="Religion Preference (Optional)"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.agePreference"
                :items="['Young (20–30)', 'Experienced (30–45)', 'Senior (45+)', 'No Preference']"
                label="Age Preference"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.tutorTypePreference"
                :items="['College-going Student', 'College Completed', 'School Teacher', 'College Lecturer', 'Coaching Tutor', 'Professional Home Tutor', 'Anyone']"
                label="Tutor Type Preference"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.qualificationPreference"
                :items="['Graduate', 'Post-Graduate', 'PhD', 'Professional Certification (CA, CS, JEE/NEET Faculty, etc.)']"
                label="Qualification Preference"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.experiencePreference"
                :items="['0–2 yrs (Beginner)', '3–5 yrs (Intermediate)', '6–10 yrs (Experienced)', '10+ yrs (Expert)']"
                label="Experience Preference"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.languagePreference"
                :items="['English', 'Hindi', 'Regional', 'No Preference']"
                label="Language Preference"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.teachingStylePreference"
                :items="['Strict/Disciplinarian', 'Friendly/Supportive', 'Exam-Oriented', 'Concept-Oriented', 'Adaptive/Flexible', 'Anyone']"
                label="Teaching Style Preference"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch
                v-model="values.backgroundVerification"
                label="Background Verification Required"
                color="primary"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch
                v-model="values.qualificationVerification"
                label="Qualification Verification Required"
                color="primary"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch
                v-model="values.experienceVerification"
                label="Experience Verification Required"
                color="primary"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="values.backupTutorPreference"
                label="Backup Tutor Preference (replacement in case of unavailability)"
                color="primary"
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
