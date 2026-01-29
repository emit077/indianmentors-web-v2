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

const schema = yup.object({
  primaryContactName: yup.string().required('Primary Contact Name is required'),
  primaryContactRelation: yup.string().required('Primary Contact Relation is required'),
  primaryContactMobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile must be 10 digits').required('Primary Contact Mobile is required'),
  primaryContactEmail: yup.string().email('Invalid email').required('Primary Contact Email is required')
});

const { handleSubmit, defineField, errors, values, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    fatherName: props.data?.fatherName || '',
    fatherMobile: props.data?.fatherMobile || '',
    fatherEmail: props.data?.fatherEmail || '',
    fatherProfession: props.data?.fatherProfession || '',
    fatherJobType: props.data?.fatherJobType || '',
    fatherDesignation: props.data?.fatherDesignation || '',
    fatherAnnualEarning: props.data?.fatherAnnualEarning || '',
    motherName: props.data?.motherName || '',
    motherMobile: props.data?.motherMobile || '',
    motherEmail: props.data?.motherEmail || '',
    motherProfession: props.data?.motherProfession || '',
    motherJobType: props.data?.motherJobType || '',
    motherDesignation: props.data?.motherDesignation || '',
    motherAnnualEarning: props.data?.motherAnnualEarning || '',
    primaryContactName: props.data?.primaryContactName || '',
    primaryContactRelation: props.data?.primaryContactRelation || '',
    primaryContactMobile: props.data?.primaryContactMobile || '',
    primaryContactWhatsApp: props.data?.primaryContactWhatsApp || '',
    primaryContactAlternate: props.data?.primaryContactAlternate || '',
    primaryContactEmail: props.data?.primaryContactEmail || '',
    billingContactPOC: props.data?.billingContactPOC || '',
    academicContactPOC: props.data?.academicContactPOC || '',
    approvalRights: props.data?.approvalRights || '',
    emergencyContactName: props.data?.emergencyContactName || '',
    emergencyContactNumber: props.data?.emergencyContactNumber || ''
  }
});

const [primaryContactName] = defineField('primaryContactName');
const [primaryContactRelation] = defineField('primaryContactRelation');
const [primaryContactMobile] = defineField('primaryContactMobile');
const [primaryContactEmail] = defineField('primaryContactEmail');

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.data) {
    setValues({
      fatherName: props.data.fatherName || '',
      fatherMobile: props.data.fatherMobile || '',
      fatherEmail: props.data.fatherEmail || '',
      fatherProfession: props.data.fatherProfession || '',
      fatherJobType: props.data.fatherJobType || '',
      fatherDesignation: props.data.fatherDesignation || '',
      fatherAnnualEarning: props.data.fatherAnnualEarning || '',
      motherName: props.data.motherName || '',
      motherMobile: props.data.motherMobile || '',
      motherEmail: props.data.motherEmail || '',
      motherProfession: props.data.motherProfession || '',
      motherJobType: props.data.motherJobType || '',
      motherDesignation: props.data.motherDesignation || '',
      motherAnnualEarning: props.data.motherAnnualEarning || '',
      primaryContactName: props.data.primaryContactName || '',
      primaryContactRelation: props.data.primaryContactRelation || '',
      primaryContactMobile: props.data.primaryContactMobile || '',
      primaryContactWhatsApp: props.data.primaryContactWhatsApp || '',
      primaryContactAlternate: props.data.primaryContactAlternate || '',
      primaryContactEmail: props.data.primaryContactEmail || '',
      billingContactPOC: props.data.billingContactPOC || '',
      academicContactPOC: props.data.academicContactPOC || '',
      approvalRights: props.data.approvalRights || '',
      emergencyContactName: props.data.emergencyContactName || '',
      emergencyContactNumber: props.data.emergencyContactNumber || ''
    });
  }
});

watch(() => props.data, (newData) => {
  if (props.modelValue && newData) {
    setValues({
      fatherName: newData.fatherName || '',
      fatherMobile: newData.fatherMobile || '',
      fatherEmail: newData.fatherEmail || '',
      fatherProfession: newData.fatherProfession || '',
      fatherJobType: newData.fatherJobType || '',
      fatherDesignation: newData.fatherDesignation || '',
      fatherAnnualEarning: newData.fatherAnnualEarning || '',
      motherName: newData.motherName || '',
      motherMobile: newData.motherMobile || '',
      motherEmail: newData.motherEmail || '',
      motherProfession: newData.motherProfession || '',
      motherJobType: newData.motherJobType || '',
      motherDesignation: newData.motherDesignation || '',
      motherAnnualEarning: newData.motherAnnualEarning || '',
      primaryContactName: newData.primaryContactName || '',
      primaryContactRelation: newData.primaryContactRelation || '',
      primaryContactMobile: newData.primaryContactMobile || '',
      primaryContactWhatsApp: newData.primaryContactWhatsApp || '',
      primaryContactAlternate: newData.primaryContactAlternate || '',
      primaryContactEmail: newData.primaryContactEmail || '',
      billingContactPOC: newData.billingContactPOC || '',
      academicContactPOC: newData.academicContactPOC || '',
      approvalRights: newData.approvalRights || '',
      emergencyContactName: newData.emergencyContactName || '',
      emergencyContactNumber: newData.emergencyContactNumber || ''
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
        <span class="text-h5">Edit Parent / Guardian Details</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12">
              <h3 class="text-h6 mb-4">Father's Details</h3>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="values.fatherName"
                label="Full Name"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="values.fatherMobile"
                label="Mobile"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="values.fatherEmail"
                label="Email"
                variant="outlined"
                density="comfortable"
                type="email"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="values.fatherProfession"
                :items="['Business', 'Job', 'Politician', 'Homemaker', 'Retired', 'Other']"
                label="Profession"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="values.fatherJobType"
                :items="['Govt', 'Private', 'Self-employed', 'NA']"
                label="Job Type"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="values.fatherDesignation"
                label="Designation"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="values.fatherAnnualEarning"
                :items="['1–4 Lacs', '5–9 Lacs', '10–14 Lacs', '15+ Lacs']"
                label="Annual Earning"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12" class="mt-4">
              <h3 class="text-h6 mb-4">Mother's Details</h3>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="values.motherName"
                label="Full Name"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="values.motherMobile"
                label="Mobile"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="values.motherEmail"
                label="Email"
                variant="outlined"
                density="comfortable"
                type="email"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="values.motherProfession"
                :items="['Business', 'Job', 'Politician', 'Homemaker', 'Retired', 'Other']"
                label="Profession"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="values.motherJobType"
                :items="['Govt', 'Private', 'Self-employed', 'NA']"
                label="Job Type"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="values.motherDesignation"
                label="Designation"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="values.motherAnnualEarning"
                :items="['1–4 Lacs', '5–9 Lacs', '10–14 Lacs', '15+ Lacs']"
                label="Annual Earning"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12" class="mt-4">
              <h3 class="text-h6 mb-4">Primary Contact (POC) *</h3>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="primaryContactName"
                label="Full Name *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.primaryContactName"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="primaryContactRelation"
                :items="['Father', 'Mother', 'Guardian', 'Other']"
                label="Relation *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.primaryContactRelation"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="primaryContactMobile"
                label="Mobile & WhatsApp Number *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.primaryContactMobile"
                maxlength="10"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="values.primaryContactWhatsApp"
                label="WhatsApp Number"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="values.primaryContactAlternate"
                label="Alternate Contact Number"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="primaryContactEmail"
                label="Email *"
                variant="outlined"
                density="comfortable"
                type="email"
                :error-messages="errors.primaryContactEmail"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.billingContactPOC"
                :items="['Father', 'Mother', 'Guardian', 'Other']"
                label="Billing Contact POC"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.academicContactPOC"
                :items="['Father', 'Mother', 'Guardian', 'Other']"
                label="Academic Contact POC"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.approvalRights"
                :items="['Father', 'Mother', 'Guardian', 'Other']"
                label="Approval Rights"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="values.emergencyContactName"
                label="Emergency Contact Name"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="values.emergencyContactNumber"
                label="Emergency Contact Number"
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
