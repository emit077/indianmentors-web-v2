<script setup lang="ts">
import { ref, computed, watch } from 'vue';
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
  mediumOfInstruction: yup.string().required('Medium of Instruction is required'),
  syllabusCoverage: yup.string().required('Syllabus Coverage is required'),
  syllabusType: yup.string().required('Syllabus Type is required'),
  learningGoals: yup.array().min(1, 'Select at least one learning goal').required()
});

const { handleSubmit, defineField, errors, values, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    mediumOfInstruction: props.data?.mediumOfInstruction || '',
    syllabusCoverage: props.data?.syllabusCoverage || '',
    syllabusType: props.data?.syllabusType || '',
    learningGoals: props.data?.learningGoals || [],
    academicStream: props.data?.academicStream || '',
    achievements: props.data?.achievements || '',
    specialConcerns: props.data?.specialConcerns || '',
    previousTuition: props.data?.previousTuition || '',
    previousTuitionDetails: props.data?.previousTuitionDetails || ''
  }
});

const [mediumOfInstruction] = defineField('mediumOfInstruction');
const [syllabusCoverage] = defineField('syllabusCoverage');
const [syllabusType] = defineField('syllabusType');
const [learningGoals] = defineField('learningGoals');

const showAcademicStream = computed(() => {
  if (!props.data?.grade) return false;
  const gradeNum = parseInt(props.data.grade.replace(/\D/g, ''));
  return gradeNum >= 11 || props.data.grade.includes('Grade 11') || props.data.grade.includes('Grade 12');
});

const documentFiles = ref<File[]>([]);

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.data) {
    setValues({
      mediumOfInstruction: props.data.mediumOfInstruction || '',
      syllabusCoverage: props.data.syllabusCoverage || '',
      syllabusType: props.data.syllabusType || '',
      learningGoals: props.data.learningGoals || [],
      academicStream: props.data.academicStream || '',
      achievements: props.data.achievements || '',
      specialConcerns: props.data.specialConcerns || '',
      previousTuition: props.data.previousTuition || '',
      previousTuitionDetails: props.data.previousTuitionDetails || ''
    });
    documentFiles.value = [];
  }
});

watch(() => props.data, (newData) => {
  if (props.modelValue && newData) {
    setValues({
      mediumOfInstruction: newData.mediumOfInstruction || '',
      syllabusCoverage: newData.syllabusCoverage || '',
      syllabusType: newData.syllabusType || '',
      learningGoals: newData.learningGoals || [],
      academicStream: newData.academicStream || '',
      achievements: newData.achievements || '',
      specialConcerns: newData.specialConcerns || '',
      previousTuition: newData.previousTuition || '',
      previousTuitionDetails: newData.previousTuitionDetails || ''
    });
  }
}, { deep: true });

const handleDocumentUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    documentFiles.value = Array.from(target.files);
  }
};

const onSubmit = handleSubmit((formValues) => {
  const dataToSave = {
    ...formValues,
    documents: documentFiles.value.length > 0 ? documentFiles.value : props.data.documents
  };
  emit('save', dataToSave);
  dialog.value = false;
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="900px" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Edit Academic Details</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="mediumOfInstruction"
                :items="['English', 'Hindi', 'Regional', 'Other']"
                label="Medium of Meeting and Interaction *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.mediumOfInstruction"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="syllabusCoverage"
                :items="['Full Syllabus', 'Subject-Specific', 'Exam-Oriented']"
                label="Syllabus Coverage *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.syllabusCoverage"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="syllabusType"
                :items="['Annual', 'Semester', 'Trimester']"
                label="Syllabus Type *"
                variant="outlined"
                density="comfortable"
                :error-messages="errors.syllabusType"
              />
            </v-col>
            <v-col cols="12" md="6" v-if="showAcademicStream">
              <v-select
                v-model="values.academicStream"
                :items="['Science', 'Commerce', 'Arts', 'General']"
                label="Academic Stream"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="mb-2">Learning Goals / Focus Area *</v-label>
              <div v-if="errors.learningGoals" class="text-error text-caption mb-2">{{ errors.learningGoals }}</div>
              <div class="d-flex flex-column">
                <v-checkbox v-model="learningGoals" label="Homework Help" value="homework" hide-details />
                <v-checkbox v-model="learningGoals" label="Concept Clarity" value="concept" hide-details />
                <v-checkbox v-model="learningGoals" label="Exam Preparation (Mid-term / Annual / Board)" value="exam" hide-details />
                <v-checkbox v-model="learningGoals" label="Competitive Exams (NEET / JEE / Olympiad / Other)" value="competitive" hide-details />
                <v-checkbox v-model="learningGoals" label="Skill Development (Coding, Arts, Languages, etc.)" value="skill" hide-details />
              </div>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="values.achievements"
                label="Achievements / Academic Awards"
                variant="outlined"
                density="comfortable"
                rows="3"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="values.specialConcerns"
                label="Special Concerns / Learning Challenges"
                variant="outlined"
                density="comfortable"
                rows="3"
                placeholder="e.g., Dyslexia, Slow Writing, Weak in Math, etc."
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="values.previousTuition"
                :items="['Yes', 'No']"
                label="Previous Tuition/Coaching Experience"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6" v-if="values.previousTuition === 'Yes'">
              <v-text-field
                v-model="values.previousTuitionDetails"
                label="Details"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12">
              <v-file-input
                label="Document Uploads (Report Card, Assignments, ID Proof)"
                variant="outlined"
                density="comfortable"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                prepend-icon="mdi-file-document"
                @change="handleDocumentUpload"
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
