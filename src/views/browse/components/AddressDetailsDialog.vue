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

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const schema = yup.object({
  country: yup.string().required(),
  state: yup.string().required('State is required'),
  city: yup.string().required('City/District is required'),
  locality: yup.string().required('Locality/Area is required'),
  streetAddress: yup.string().required('Street Address is required'),
  pincode: yup.string().matches(/^[0-9]{6}$/, 'Pincode must be 6 digits').required('Pincode is required')
});

const { handleSubmit, defineField, errors, values, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    country: props.data?.country || 'India',
    state: props.data?.state || '',
    city: props.data?.city || '',
    locality: props.data?.locality || '',
    streetAddress: props.data?.streetAddress || '',
    pincode: props.data?.pincode || '',
    landmark: props.data?.landmark || '',
    addressType: props.data?.addressType || 'Permanent',
    commuteAvailability: props.data?.commuteAvailability || false
  }
});

const [country] = defineField('country');
const [state] = defineField('state');
const [city] = defineField('city');
const [locality] = defineField('locality');
const [streetAddress] = defineField('streetAddress');
const [pincode] = defineField('pincode');

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.data) {
    setValues({
      country: props.data.country || 'India',
      state: props.data.state || '',
      city: props.data.city || '',
      locality: props.data.locality || '',
      streetAddress: props.data.streetAddress || '',
      pincode: props.data.pincode || '',
      landmark: props.data.landmark || '',
      addressType: props.data.addressType || 'Permanent',
      commuteAvailability: props.data.commuteAvailability || false
    });
  }
});

watch(() => props.data, (newData) => {
  if (props.modelValue && newData) {
    setValues({
      country: newData.country || 'India',
      state: newData.state || '',
      city: newData.city || '',
      locality: newData.locality || '',
      streetAddress: newData.streetAddress || '',
      pincode: newData.pincode || '',
      landmark: newData.landmark || '',
      addressType: newData.addressType || 'Permanent',
      commuteAvailability: newData.commuteAvailability || false
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
        <span class="text-h5">Edit Address Details</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="country"
                label="Country *"
                variant="outlined"
                density="comfortable"
                readonly
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="state"
                :items="states"
                label="State *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.state"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="city"
                label="City/District *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.city"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="locality"
                label="Locality/Area *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.locality"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="streetAddress"
                label="Street Address & House/Flat No. *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.streetAddress"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="pincode"
                label="Pincode/ZIP Code *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.pincode"
                maxlength="6"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="values.landmark"
                label="Landmark"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.addressType"
                :items="['Permanent', 'Current', 'Hostel']"
                label="Address Type"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="values.commuteAvailability"
                label="Commute Availability (for travelling to tutor/center)"
                color="primary"
              />
            </v-col>
            <v-col cols="12">
              <v-btn variant="outlined" color="primary" prepend-icon="mdi-map-marker">
                Google Maps Pin-drop (Geo-tagging)
              </v-btn>
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
