<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import BasicDetailsDialog from "./components/BasicDetailsDialog.vue";
import AcademicDetailsDialog from "./components/AcademicDetailsDialog.vue";
import AddressDetailsDialog from "./components/AddressDetailsDialog.vue";
import TutoringPreferencesDialog from "./components/TutoringPreferencesDialog.vue";
import TutorPreferencesDialog from "./components/TutorPreferencesDialog.vue";
import ParentDetailsDialog from "./components/ParentDetailsDialog.vue";
import ReferralDialog from "./components/ReferralDialog.vue";
import AdditionalDetailsDialog from "./components/AdditionalDetailsDialog.vue";

// Student profile data - stored in reactive state
const studentData = ref<any>({
  // Basic Details
  profilePicture: null,
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  age: "",
  gender: "",
  grade: "",
  schoolName: "",
  board: "",
  subjects: [],
  learningMode: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  courseName: "",
  studentId: "",

  // Academic Details
  mediumOfInstruction: "",
  syllabusCoverage: "",
  syllabusType: "",
  academicStream: "",
  learningGoals: [],
  achievements: "",
  specialConcerns: "",
  previousTuition: "",
  previousTuitionDetails: "",
  documents: [],

  // Address Details
  country: "India",
  locality: "",
  streetAddress: "",
  landmark: "",
  addressType: "Permanent",
  commuteAvailability: false,

  // Tutoring Preferences
  classMode: "",
  batchType: "",
  careerAspirations: [],
  weekPreference: [],
  daysPreference: [],
  timeSlots: [],
  sessionDuration: "",
  budgetRange: "",
  planToHire: "",
  hobbies: [],
  specialConcernsTutoring: [],
  specialServices: [],
  backupTutor: false,
  trialSession: false,
  subscriptionPlan: "",

  // Tutor Preferences
  genderPreference: "",
  religionPreference: "",
  agePreference: "",
  tutorTypePreference: "",
  qualificationPreference: "",
  experiencePreference: "",
  languagePreference: "",
  teachingStylePreference: "",
  backgroundVerification: false,
  qualificationVerification: false,
  experienceVerification: false,
  backupTutorPreference: false,

  // Parent Details
  fatherName: "",
  fatherMobile: "",
  fatherEmail: "",
  fatherProfession: "",
  fatherJobType: "",
  fatherDesignation: "",
  fatherAnnualEarning: "",
  motherName: "",
  motherMobile: "",
  motherEmail: "",
  motherProfession: "",
  motherJobType: "",
  motherDesignation: "",
  motherAnnualEarning: "",
  primaryContactName: "",
  primaryContactRelation: "",
  primaryContactMobile: "",
  primaryContactWhatsApp: "",
  primaryContactAlternate: "",
  primaryContactEmail: "",
  billingContactPOC: "",
  academicContactPOC: "",
  approvalRights: "",
  emergencyContactName: "",
  emergencyContactNumber: "",

  // Referral
  referralSource: "",
  referralOther: "",

  // Additional
  idProof: null,
});

// Dialog states
const basicDetailsDialog = ref(false);
const academicDetailsDialog = ref(false);
const addressDetailsDialog = ref(false);
const tutoringPreferencesDialog = ref(false);
const tutorPreferencesDialog = ref(false);
const parentDetailsDialog = ref(false);
const referralDialog = ref(false);
const additionalDetailsDialog = ref(false);

// Computed properties for display
const fullName = computed(() => {
  if (studentData.value.firstName || studentData.value.lastName) {
    return `${studentData.value.firstName} ${studentData.value.lastName}`.trim();
  }
  return "Not provided";
});

const profilePictureUrl = computed(() => {
  if (studentData.value.profilePicture) {
    return typeof studentData.value.profilePicture === "string"
      ? studentData.value.profilePicture
      : URL.createObjectURL(studentData.value.profilePicture);
  }
  return null;
});

// Load data from localStorage on mount
onMounted(() => {
  const savedData = localStorage.getItem("studentProfileData");
  if (savedData) {
    try {
      studentData.value = { ...studentData.value, ...JSON.parse(savedData) };
    } catch (e) {
      console.error("Error loading saved data:", e);
    }
  }

  // Auto-generate student ID if name is available
  if (
    studentData.value.firstName &&
    studentData.value.lastName &&
    !studentData.value.studentId
  ) {
    const initials = (
      studentData.value.firstName.charAt(0) + studentData.value.lastName.charAt(0)
    ).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    studentData.value.studentId = `STU${initials}${random}`;
  }
});

// Save section data
const saveSectionData = (section: string, data: any) => {
  studentData.value = { ...studentData.value, ...data };
  localStorage.setItem("studentProfileData", JSON.stringify(studentData.value));
};

// Format display helpers
const formatArray = (arr: any[]) => {
  if (!arr || arr.length === 0) return "Not provided";
  return Array.isArray(arr) ? arr.join(", ") : arr;
};

const formatBoolean = (val: boolean) => (val ? "Yes" : "No");

const formatDate = (date: string) => {
  if (!date) return "Not provided";
  return new Date(date).toLocaleDateString("en-GB");
};

const onDownloadPDF = () => {
  // Generate and download PDF
  alert("PDF download functionality would be implemented here");
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Student Profile</h1>
          <v-btn color="primary" prepend-icon="mdi-download" @click="onDownloadPDF">
            Download Profile (PDF)
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 1. Basic Student Details -->
    <v-row>
      <v-col cols="12">
        <UiParentCard title="👤 Basic Student Details">
          <template #action>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="basicDetailsDialog = true"
            />
          </template>
          <v-row>
            <v-col cols="12" md="3" class="text-center">
              <v-avatar size="120" class="mb-3">
                <v-img v-if="profilePictureUrl" :src="profilePictureUrl" />
                <v-icon v-else size="60">mdi-account</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="12" md="9">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis mb-1">Full Name</div>
                  <div class="text-body-1 mb-4">{{ fullName }}</div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="text-caption text-medium-emphasis mb-1">Date of Birth</div>
                  <div class="text-body-1 mb-4">
                    {{ formatDate(studentData.dateOfBirth) }}
                  </div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="text-caption text-medium-emphasis mb-1">Age</div>
                  <div class="text-body-1 mb-4">
                    {{ studentData.age || "Not provided" }}
                  </div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="text-caption text-medium-emphasis mb-1">Gender</div>
                  <div class="text-body-1 mb-4">
                    {{ studentData.gender || "Not provided" }}
                  </div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="text-caption text-medium-emphasis mb-1">Grade/Class</div>
                  <div class="text-body-1 mb-4">
                    {{ studentData.grade || "Not provided" }}
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis mb-1">
                    School/College Name
                  </div>
                  <div class="text-body-1 mb-4">
                    {{ studentData.schoolName || "Not provided" }}
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis mb-1">
                    Board/University/Curriculum
                  </div>
                  <div class="text-body-1 mb-4">
                    {{ studentData.board || "Not provided" }}
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis mb-1">Subjects Opted</div>
                  <div class="text-body-1 mb-4">
                    {{ formatArray(studentData.subjects) }}
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis mb-1">
                    Preferred Learning Mode
                  </div>
                  <div class="text-body-1 mb-4">
                    {{ studentData.learningMode || "Not provided" }}
                  </div>
                </v-col>
                <v-col cols="12" md="6" v-if="studentData.courseName">
                  <div class="text-caption text-medium-emphasis mb-1">Course Name</div>
                  <div class="text-body-1 mb-4">{{ studentData.courseName }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis mb-1">Student ID</div>
                  <div class="text-body-1 mb-4">
                    {{ studentData.studentId || "Not generated" }}
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="basicDetailsDialog = true"
            >
              Edit Basic Details
            </v-btn>
          </div>
        </UiParentCard>
      </v-col>
    </v-row>

    <!-- 2. Academic Details -->
    <v-row>
      <v-col cols="12">
        <UiParentCard title="📘 Academic Details">
          <template #action>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="academicDetailsDialog = true"
            />
          </template>
          <v-row>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">
                Medium of Instruction
              </div>
              <div class="text-body-1 mb-4">
                {{ studentData.mediumOfInstruction || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Syllabus Coverage</div>
              <div class="text-body-1 mb-4">
                {{ studentData.syllabusCoverage || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Syllabus Type</div>
              <div class="text-body-1 mb-4">
                {{ studentData.syllabusType || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="6" v-if="studentData.academicStream">
              <div class="text-caption text-medium-emphasis mb-1">Academic Stream</div>
              <div class="text-body-1 mb-4">{{ studentData.academicStream }}</div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">Learning Goals</div>
              <div class="text-body-1 mb-4">
                {{ formatArray(studentData.learningGoals) }}
              </div>
            </v-col>
            <v-col cols="12" v-if="studentData.achievements">
              <div class="text-caption text-medium-emphasis mb-1">Achievements</div>
              <div class="text-body-1 mb-4">{{ studentData.achievements }}</div>
            </v-col>
            <v-col cols="12" v-if="studentData.specialConcerns">
              <div class="text-caption text-medium-emphasis mb-1">Special Concerns</div>
              <div class="text-body-1 mb-4">{{ studentData.specialConcerns }}</div>
            </v-col>
            <v-col cols="12" md="6" v-if="studentData.previousTuition">
              <div class="text-caption text-medium-emphasis mb-1">
                Previous Tuition Experience
              </div>
              <div class="text-body-1 mb-4">{{ studentData.previousTuition }}</div>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="academicDetailsDialog = true"
            >
              Edit Academic Details
            </v-btn>
          </div>
        </UiParentCard>
      </v-col>
    </v-row>

    <!-- 3. Address Details -->
    <v-row>
      <v-col cols="12">
        <UiParentCard title="📍 Address Details">
          <template #action>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="addressDetailsDialog = true"
            />
          </template>
          <v-row>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Country</div>
              <div class="text-body-1 mb-4">
                {{ studentData.country || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">State</div>
              <div class="text-body-1 mb-4">
                {{ studentData.state || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">City/District</div>
              <div class="text-body-1 mb-4">{{ studentData.city || "Not provided" }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">Locality/Area</div>
              <div class="text-body-1 mb-4">
                {{ studentData.locality || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">Street Address</div>
              <div class="text-body-1 mb-4">
                {{ studentData.streetAddress || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Pincode</div>
              <div class="text-body-1 mb-4">
                {{ studentData.pincode || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Address Type</div>
              <div class="text-body-1 mb-4">
                {{ studentData.addressType || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">
                Commute Availability
              </div>
              <div class="text-body-1 mb-4">
                {{ formatBoolean(studentData.commuteAvailability) }}
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="addressDetailsDialog = true"
            >
              Edit Address Details
            </v-btn>
          </div>
        </UiParentCard>
      </v-col>
    </v-row>

    <!-- 4. Tutoring Service Preferences -->
    <v-row>
      <v-col cols="12">
        <UiParentCard title="🎯 Tutoring Service Preferences">
          <template #action>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="tutoringPreferencesDialog = true"
            />
          </template>
          <v-row>
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">Mode of Class</div>
              <div class="text-body-1 mb-4">
                {{ studentData.classMode || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">Batch Type</div>
              <div class="text-body-1 mb-4">
                {{ studentData.batchType || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">Career Aspirations</div>
              <div class="text-body-1 mb-4">
                {{ formatArray(studentData.careerAspirations) }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Budget Range</div>
              <div class="text-body-1 mb-4">
                {{ studentData.budgetRange || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Plan to Hire</div>
              <div class="text-body-1 mb-4">
                {{ studentData.planToHire || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Session Duration</div>
              <div class="text-body-1 mb-4">
                {{ studentData.sessionDuration || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">Hobbies/Interests</div>
              <div class="text-body-1 mb-4">{{ formatArray(studentData.hobbies) }}</div>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="tutoringPreferencesDialog = true"
            >
              Edit Tutoring Preferences
            </v-btn>
          </div>
        </UiParentCard>
      </v-col>
    </v-row>

    <!-- 5. Tutor Preference Details -->
    <v-row>
      <v-col cols="12">
        <UiParentCard title="👨‍🏫 Tutor Preference Details">
          <template #action>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="tutorPreferencesDialog = true"
            />
          </template>
          <v-row>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Gender Preference</div>
              <div class="text-body-1 mb-4">
                {{ studentData.genderPreference || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Age Preference</div>
              <div class="text-body-1 mb-4">
                {{ studentData.agePreference || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Tutor Type</div>
              <div class="text-body-1 mb-4">
                {{ studentData.tutorTypePreference || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">
                Qualification Preference
              </div>
              <div class="text-body-1 mb-4">
                {{ studentData.qualificationPreference || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">
                Experience Preference
              </div>
              <div class="text-body-1 mb-4">
                {{ studentData.experiencePreference || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Teaching Style</div>
              <div class="text-body-1 mb-4">
                {{ studentData.teachingStylePreference || "Not provided" }}
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="tutorPreferencesDialog = true"
            >
              Edit Tutor Preferences
            </v-btn>
          </div>
        </UiParentCard>
      </v-col>
    </v-row>

    <!-- 6. Parent / Guardian Details -->
    <v-row>
      <v-col cols="12">
        <UiParentCard title="👨‍👩‍👧 Parent / Guardian Details">
          <template #action>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="parentDetailsDialog = true"
            />
          </template>
          <v-row>
            <v-col cols="12">
              <h3 class="text-h6 mb-4">Primary Contact</h3>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Name</div>
              <div class="text-body-1 mb-4">
                {{ studentData.primaryContactName || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Relation</div>
              <div class="text-body-1 mb-4">
                {{ studentData.primaryContactRelation || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis mb-1">Mobile</div>
              <div class="text-body-1 mb-4">
                {{ studentData.primaryContactMobile || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">Email</div>
              <div class="text-body-1 mb-4">
                {{ studentData.primaryContactEmail || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">Emergency Contact</div>
              <div class="text-body-1 mb-4">
                {{ studentData.emergencyContactName || "Not provided" }}
                <span v-if="studentData.emergencyContactNumber">
                  - {{ studentData.emergencyContactNumber }}</span
                >
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="parentDetailsDialog = true"
            >
              Edit Parent Details
            </v-btn>
          </div>
        </UiParentCard>
      </v-col>
    </v-row>

    <!-- 7. Referral Source -->
    <v-row>
      <v-col cols="12">
        <UiParentCard title="📢 How Did You Hear About Us?">
          <template #action>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="referralDialog = true"
            />
          </template>
          <v-row>
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">Referral Source</div>
              <div class="text-body-1 mb-4">
                {{ studentData.referralSource || "Not provided" }}
              </div>
            </v-col>
            <v-col cols="12" md="6" v-if="studentData.referralOther">
              <div class="text-caption text-medium-emphasis mb-1">Details</div>
              <div class="text-body-1 mb-4">{{ studentData.referralOther }}</div>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="referralDialog = true"
            >
              Edit Referral Source
            </v-btn>
          </div>
        </UiParentCard>
      </v-col>
    </v-row>

    <!-- 8. Additional Details -->
    <v-row>
      <v-col cols="12">
        <UiParentCard title="📎 Additional Details">
          <template #action>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="additionalDetailsDialog = true"
            />
          </template>
          <v-row>
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">ID Proof Uploaded</div>
              <div class="text-body-1 mb-4">{{ studentData.idProof ? "Yes" : "No" }}</div>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="additionalDetailsDialog = true"
            >
              Edit Additional Details
            </v-btn>
          </div>
        </UiParentCard>
      </v-col>
    </v-row>

    <!-- Action Buttons -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex gap-3 justify-end">
          <v-btn variant="outlined" color="info" prepend-icon="mdi-account-plus">
            Link Another Child
          </v-btn>
          <v-btn variant="outlined" color="success" prepend-icon="mdi-check" size="large">
            Submit Registration
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <BasicDetailsDialog
      v-model="basicDetailsDialog"
      :data="studentData"
      @save="saveSectionData('basic', $event)"
    />
    <AcademicDetailsDialog
      v-model="academicDetailsDialog"
      :data="studentData"
      @save="saveSectionData('academic', $event)"
    />
    <AddressDetailsDialog
      v-model="addressDetailsDialog"
      :data="studentData"
      @save="saveSectionData('address', $event)"
    />
    <TutoringPreferencesDialog
      v-model="tutoringPreferencesDialog"
      :data="studentData"
      @save="saveSectionData('tutoring', $event)"
    />
    <TutorPreferencesDialog
      v-model="tutorPreferencesDialog"
      :data="studentData"
      @save="saveSectionData('tutorPrefs', $event)"
    />
    <ParentDetailsDialog
      v-model="parentDetailsDialog"
      :data="studentData"
      @save="saveSectionData('parent', $event)"
    />
    <ReferralDialog
      v-model="referralDialog"
      :data="studentData"
      @save="saveSectionData('referral', $event)"
    />
    <AdditionalDetailsDialog
      v-model="additionalDetailsDialog"
      :data="studentData"
      @save="saveSectionData('additional', $event)"
    />
  </v-container>
</template>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>
