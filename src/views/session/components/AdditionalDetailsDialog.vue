<script setup lang="ts">
import { ref, computed, watch } from 'vue';
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
    idProof: props.data?.idProof || null
  }
});

const idProofFile = ref<File | null>(null);

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.data) {
    setValues({
      idProof: props.data.idProof || null
    });
    idProofFile.value = null;
  }
});

watch(() => props.data, (newData) => {
  if (props.modelValue && newData) {
    setValues({
      idProof: newData.idProof || null
    });
  }
}, { deep: true });

const handleIdProofUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    idProofFile.value = target.files[0];
  }
};

const onSubmit = handleSubmit((formValues) => {
  const dataToSave = {
    ...formValues,
    idProof: idProofFile.value || props.data.idProof
  };
  emit('save', dataToSave);
  dialog.value = false;
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Edit Additional Details</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12">
              <v-file-input
                label="Upload ID Proof / School ID (optional)"
                variant="outlined"
                density="comfortable"
                accept=".pdf,.jpg,.jpeg,.png"
                prepend-icon="mdi-file-document"
                @change="handleIdProofUpload"
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
