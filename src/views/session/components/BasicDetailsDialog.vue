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

const grades = [
  'Nursery',
  'LKG',
  'UKG',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'UG',
  'PG'
];

const boards = ['CBSE', 'ICSE', 'IB', 'IGCSE', 'State Board', 'Other'];

const subjectOptions = [
  'Math',
  'Science',
  'English',
  'Hindi',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Economics',
  'Commerce',
  'Accounts',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
  'Sanskrit',
  'French',
  'German',
  'Other'
];

const schema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  dateOfBirth: yup.string().required('Date of Birth is required'),
  gender: yup.string().required('Gender is required'),
  grade: yup.string().required('Grade/Class is required'),
  schoolName: yup.string().required('School/College Name is required'),
  board: yup.string().required('Board/University/Curriculum is required'),
  subjects: yup.array().min(1, 'Select at least one subject').required('Subjects are required'),
  learningMode: yup.string().required('Preferred Learning Mode is required')
});

const { handleSubmit, defineField, errors, values, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: props.data?.firstName || '',
    lastName: props.data?.lastName || '',
    dateOfBirth: props.data?.dateOfBirth || '',
    gender: props.data?.gender || '',
    grade: props.data?.grade || '',
    schoolName: props.data?.schoolName || '',
    board: props.data?.board || '',
    subjects: props.data?.subjects || [],
    learningMode: props.data?.learningMode || '',
    courseName: props.data?.courseName || ''
  }
});

const [firstName] = defineField('firstName');
const [lastName] = defineField('lastName');
const [dateOfBirth] = defineField('dateOfBirth');
const [gender] = defineField('gender');
const [grade] = defineField('grade');
const [schoolName] = defineField('schoolName');
const [board] = defineField('board');
const [subjects] = defineField('subjects');
const [learningMode] = defineField('learningMode');

const profilePictureFile = ref<File | null>(null);
const profilePictureUrl = computed(() => {
  if (profilePictureFile.value) {
    return URL.createObjectURL(profilePictureFile.value);
  }
  if (props.data?.profilePicture) {
    return typeof props.data.profilePicture === 'string' ? props.data.profilePicture : URL.createObjectURL(props.data.profilePicture);
  }
  return null;
});

const age = computed(() => {
  if (!dateOfBirth.value) return '';
  const birthDate = new Date(dateOfBirth.value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
});

const studentId = computed(() => {
  if (!firstName.value || !lastName.value) return '';
  const initials = (firstName.value.charAt(0) + lastName.value.charAt(0)).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `STU${initials}${random}`;
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.data) {
      setValues({
        firstName: props.data.firstName || '',
        lastName: props.data.lastName || '',
        dateOfBirth: props.data.dateOfBirth || '',
        gender: props.data.gender || '',
        grade: props.data.grade || '',
        schoolName: props.data.schoolName || '',
        board: props.data.board || '',
        subjects: props.data.subjects || [],
        learningMode: props.data.learningMode || '',
        courseName: props.data.courseName || ''
      });
      profilePictureFile.value = null;
    }
  }
);

watch(
  () => props.data,
  (newData) => {
    if (props.modelValue && newData) {
      setValues({
        firstName: newData.firstName || '',
        lastName: newData.lastName || '',
        dateOfBirth: newData.dateOfBirth || '',
        gender: newData.gender || '',
        grade: newData.grade || '',
        schoolName: newData.schoolName || '',
        board: newData.board || '',
        subjects: newData.subjects || [],
        learningMode: newData.learningMode || '',
        courseName: newData.courseName || ''
      });
    }
  },
  { deep: true }
);

const handleProfilePictureUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    profilePictureFile.value = target.files[0];
  }
};

const onSubmit = handleSubmit((formValues) => {
  const dataToSave = {
    ...formValues,
    age: age.value,
    studentId: studentId.value,
    profilePicture: profilePictureFile.value || props.data.profilePicture
  };
  emit('save', dataToSave);
  dialog.value = false;
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="900px" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Edit Basic Student Details</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12" md="3" class="text-center">
              <v-card variant="outlined" class="pa-4">
                <v-avatar size="120" class="mb-3">
                  <v-img v-if="profilePictureUrl" :src="profilePictureUrl" />
                  <v-icon v-else size="60">mdi-account</v-icon>
                </v-avatar>
                <v-file-input
                  label="Upload Photo"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  density="compact"
                  accept="image/*"
                  @change="handleProfilePictureUpload"
                />
              </v-card>
            </v-col>
            <v-col cols="12" md="9">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="firstName"
                    label="First Name *"
                    variant="outlined"
                    density="comfortable"
                    :error-messages="errors.firstName"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="lastName"
                    label="Last Name *"
                    variant="outlined"
                    density="comfortable"
                    :error-messages="errors.lastName"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="dateOfBirth"
                    label="Date of Birth *"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    :error-messages="errors.dateOfBirth"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field :model-value="age" label="Age (Auto-calculated)" variant="outlined" density="comfortable" readonly />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="gender"
                    :items="['Male', 'Female', 'Other', 'Prefer not to say']"
                    label="Gender *"
                    variant="outlined"
                    density="comfortable"
                    :error-messages="errors.gender"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="grade"
                    :items="grades"
                    label="Grade/Class *"
                    variant="outlined"
                    density="comfortable"
                    :error-messages="errors.grade"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="schoolName"
                    label="School/College Name *"
                    variant="outlined"
                    density="comfortable"
                    :error-messages="errors.schoolName"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="board"
                    :items="boards"
                    label="Board/University/Curriculum *"
                    variant="outlined"
                    density="comfortable"
                    :error-messages="errors.board"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="subjects"
                    :items="subjectOptions"
                    label="Subjects Opted *"
                    variant="outlined"
                    density="comfortable"
                    multiple
                    chips
                    :error-messages="errors.subjects"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="learningMode"
                    :items="['Online', 'Offline', 'Hybrid']"
                    label="Preferred Learning Mode *"
                    variant="outlined"
                    density="comfortable"
                    :error-messages="errors.learningMode"
                  />
                </v-col>
                <v-col cols="12" md="6" v-if="grade && (grade.includes('UG') || grade.includes('PG'))">
                  <v-text-field
                    v-model="values.courseName"
                    label="Course Name (e.g., B.Tech/B.Sc/B.Com)"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="studentId"
                    label="Unique Student ID (Auto-generated)"
                    variant="outlined"
                    density="comfortable"
                    readonly
                  />
                </v-col>
              </v-row>
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
