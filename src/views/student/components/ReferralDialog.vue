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

const referralSources = [
  'Google Search',
  'Justdial / Sulekha',
  'Social Media (Facebook / Instagram / LinkedIn / YouTube / WhatsApp)',
  'Word of Mouth (Family/Friends/Relatives)',
  'Referral (Parent / Student / Tutor / Employee / Partner)',
  'School/College Recommendation',
  'Channel Partner / Agent',
  'Flyer / Poster / Newspaper Ad',
  'Events / Seminars / Workshops',
  'WhatsApp / SMS Campaign',
  'Others'
];

const schema = yup.object({
  referralSource: yup.string().required('Referral Source is required')
});

const { handleSubmit, defineField, errors, values, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    referralSource: props.data?.referralSource || '',
    referralOther: props.data?.referralOther || ''
  }
});

const [referralSource] = defineField('referralSource');

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.data) {
    setValues({
      referralSource: props.data.referralSource || '',
      referralOther: props.data.referralOther || ''
    });
  }
});

watch(() => props.data, (newData) => {
  if (props.modelValue && newData) {
    setValues({
      referralSource: newData.referralSource || '',
      referralOther: newData.referralOther || ''
    });
  }
}, { deep: true });

const onSubmit = handleSubmit((formValues) => {
  emit('save', formValues);
  dialog.value = false;
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Edit Referral Source</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="referralSource"
                :items="referralSources"
                label="Referral Source *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.referralSource"
              />
            </v-col>
            <v-col cols="12" v-if="referralSource === 'Others'">
              <v-text-field
                v-model="values.referralOther"
                label="Please Specify"
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
