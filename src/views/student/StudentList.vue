<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";
import {
  mdiCheckDecagram,
  mdiTableLarge,
  mdiListBoxOutline,
  mdiAccountBoxOutline,
  mdiTrayArrowDown,
  mdiTuneVariant,
} from "@mdi/js";
import ProfileCard from "@/components/shared/ProfileCard.vue";
import ProfileList from "@/components/shared/ProfileList.vue";
import DataTable from "@/components/datatable/DataTable.vue";

import {
  profileCardConfig,
  profileListConfig,
  headers,
} from "@/configs/student/student_list";

// Student data interface
interface Student {
  user_table_id: string;
  student_id: string;
  is_active: boolean;
  name: string;
  mobile: string;
  email: string;
  father_name: string;
  mother_name: string;
  gender: string;
  date_of_birth: string;
  dob: string;
  father_contact_number: string;
  mother_contact_number: string;
  whatsapp_number: string;
  parent_email: string | null;
  contact_person: string;
  contact_person_name: string | null;
  contact_person_mobile: string | null;
  address: string;
  pin_code: string;
  city: string;
  state: string;
  class_name: string;
  education_board: string;
  special_concern: string;
  profile_status: string;
  signup_date: string;
}

// Sample data - replace with API call
const studentList = ref<Student[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const tab = ref("table");

// Sample data for demonstration
const sampleData: Student[] = [
  {
    user_table_id: "43319",
    student_id: "IM25STU0003063",
    is_active: true,
    name: "Samridhhi sahu",
    mobile: "9827133567",
    email: "Monikasahu33567@gmail.com",
    father_name: "Hemant kumar sahu",
    mother_name: "Monika sahu",
    gender: "Female",
    date_of_birth: "2009-01-05",
    dob: "05 Jan 2009",
    father_contact_number: "9424100567",
    mother_contact_number: "9827133567",
    whatsapp_number: "9827133567",
    parent_email: "null",
    contact_person: "Mother",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "B22 royal green junwani road bhilai",
    pin_code: "490020",
    city: "Bhilai",
    state: "Chhattisgarh",
    class_name: "11th",
    education_board: "Cbse",
    special_concern: "",
    profile_status: "Completed",
    signup_date: "21 Nov 2025 06:57 PM",
  },
  {
    id: 3077,
    user_table_id: "43316",
    student_table_id: "3077",
    student_id: "IM25STU0003062",
    is_active: true,
    name: "Aanya agrawal",
    mobile: "9826570100",
    email: "Umeshdagrawal@gmail.com",
    father_name: "Umesh Agrawal",
    mother_name: "Pragya Agrawal",
    gender: "Female",
    date_of_birth: "2008-07-23",
    dob: "23 Jul 2008",
    father_contact_number: "9826570100",
    mother_contact_number: "null",
    whatsapp_number: "9826570100",
    parent_email: "null",
    contact_person: "Father",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "Villa no 33, Ambience villa, near Fundahar chowk",
    pin_code: "492015",
    latitude: "21.2098521",
    longitude: "81.6870907",
    city: "Mana Camp",
    state: "Chhattisgarh",
    class_name: "12th",
    class_id: 38,
    school_name: "Athena world school",
    education_board: "Cbse",
    tutor_preference: "Female",
    teaching_preference: ["My Home"],
    special_concern: "",
    time_slots_id_list: [8],
    subjects_list: ["Physics", "Chemistry"],
    subject_id_list: [12, 13],
    profile_status: "Active",
    signup_date: "21 Nov 2025 11:06 AM",
    suitable_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    hobbies: "",
    landmark: "Ambience villas",
    class_mode: "Offline",
    counselling_status: "",
  },
  {
    id: 3076,
    user_table_id: "43311",
    student_table_id: "3076",
    student_id: "IM25STU0003061",
    is_active: true,
    name: "Neha Nirmalkar",
    mobile: "5000000116",
    email: "nirmalkarn037@gmail.com",
    father_name: "Dilesh Nirmalkar ",
    mother_name: "Sunita Nirmalkar ",
    gender: "Female",
    date_of_birth: "2002-12-13",
    dob: "13 Dec 2002",
    father_contact_number: "9827977632",
    mother_contact_number: "9827977633",
    whatsapp_number: "9303489549",
    parent_email: "null",
    contact_person: "Mother",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "Bhatagao ravatpura phase-2 sai mandir raipur chhattisgarh ",
    pin_code: "492001",
    latitude: "null",
    longitude: "null",
    city: "Raipur",
    state: "Chhattisgarh",
    class_name: "12th",
    class_id: 38,
    school_name: "Nutan higher secondary school ",
    education_board: "Cgbsc",
    tutor_preference: "Female",
    teaching_preference: ["Tutor's Home", "Tuition Center"],
    special_concern: "",
    time_slots_id_list: [13, 16, 17, 18, 19, 20, 21, 22, 23],
    subjects_list: ["Mathematics"],
    subject_id_list: [2],
    profile_status: "Completed",
    signup_date: "20 Nov 2025 01:39 PM",
    suitable_days: [
      "Monday",
      "Tuesday",
      "Thursday",
      "Wednesday",
      "Saturday",
      "Friday",
      "Sunday",
    ],
    hobbies: "Study reading books",
    landmark: "Bhatagao ravatpura phase-2 ",
    class_mode: ["Online", "Offline"],
    counselling_status: "",
  },
  {
    id: 3075,
    user_table_id: "43310",
    student_table_id: "3075",
    student_id: "IM25STU0003060",
    is_active: true,
    name: "Shivangi Saxena",
    mobile: "5000000117",
    email: "saxenashivangi332@gmail.com",
    father_name: "Shailendra Saxena ",
    mother_name: "Annu Saxena ",
    gender: "Female",
    date_of_birth: "1999-10-25",
    dob: "25 Oct 1999",
    father_contact_number: "9890993313",
    mother_contact_number: "9922679205",
    whatsapp_number: "7798835471",
    parent_email: "null",
    contact_person: "Mother",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "Row house no. 75, Ravi Garden Manjari Bk Solapur road Hadapsar Pune ",
    pin_code: "412307",
    latitude: "18.5000732",
    longitude: "73.963543",
    city: "Haveli",
    state: "Maharashtra",
    class_name: "10th",
    class_id: 36,
    school_name: "City International School ",
    education_board: "CBSE",
    tutor_preference: "Any",
    teaching_preference: ["My Home"],
    special_concern: "",
    time_slots_id_list: [],
    subjects_list: ["Mathematics", "Science", "Social Science", "Hindi", "English"],
    subject_id_list: [2, 4, 5, 6, 7],
    profile_status: "Completed",
    signup_date: "20 Nov 2025 12:30 PM",
    suitable_days: ["Sunday", "Saturday"],
    hobbies: "Reading, Hiking, Sketching ",
    landmark: "Opp HP petrol pump ",
    class_mode: "Online",
    counselling_status: "",
  },
  {
    id: 3074,
    user_table_id: "43303",
    student_table_id: "3074",
    student_id: "IM25STU0003059",
    is_active: true,
    name: "Spandan Gaikwad ",
    mobile: "8459510473",
    email: "truptijadhavgaikwad@gmail.com",
    father_name: "Shashank Gaikwad ",
    mother_name: "Trupti Gaikwad",
    gender: "Male",
    date_of_birth: "2014-09-22",
    dob: "22 Sep 2014",
    father_contact_number: "8788658456",
    mother_contact_number: "8459510473",
    whatsapp_number: "8888975454",
    parent_email: "null",
    contact_person: "Mother",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "Rakshak Nagar Phase 1",
    pin_code: "411014",
    latitude: "null",
    longitude: "null",
    city: "Pune City",
    state: "Maharashtra",
    class_name: "5th",
    class_id: 31,
    school_name: "Wisdom world school Hadapsar",
    education_board: "Icsc",
    tutor_preference: "Any",
    teaching_preference: ["My Home"],
    special_concern: "No hitting.screaming.",
    time_slots_id_list: [7, 8, 17, 18],
    subjects_list: ["All Subjects"],
    subject_id_list: [1],
    profile_status: "Active",
    signup_date: "19 Nov 2025 04:48 PM",
    suitable_days: ["Wednesday", "Thursday", "Monday", "Tuesday", "Friday", "Saturday"],
    hobbies: "Playing ",
    landmark: "Rakshak Nagar kharadi",
    class_mode: "Offline",
    counselling_status: "",
  },
  {
    id: 3073,
    user_table_id: "43296",
    student_table_id: "3073",
    student_id: "IM25STU0003058",
    is_active: true,
    name: "Shubhangi",
    mobile: "5000000115",
    email: "Shubhangigadare@gmail.com",
    father_name: "-",
    mother_name: "-",
    gender: "Female",
    date_of_birth: "1994-03-22",
    dob: "22 Mar 1994",
    father_contact_number: "8605221791",
    mother_contact_number: "9096456533",
    whatsapp_number: "9284439869",
    parent_email: "null",
    contact_person: "Other",
    contact_person_name: "Swapnil",
    contact_person_mobile: "9096456533",
    address: "Anand park, near oxygen valley manjari budruk",
    pin_code: "412307",
    latitude: "18.521266",
    longitude: "73.98257339999999",
    city: "Haveli",
    state: "Maharashtra",
    class_name: "",
    class_id: "",
    school_name: null,
    education_board: null,
    tutor_preference: "",
    teaching_preference: [],
    special_concern: "",
    time_slots_id_list: [],
    subjects_list: [],
    subject_id_list: [],
    profile_status: "Incomplete",
    signup_date: "18 Nov 2025 11:57 PM",
    suitable_days: [],
    hobbies: "",
    landmark: "Manjari budruk",
    class_mode: [],
    counselling_status: "",
  },
  {
    id: 3072,
    user_table_id: "43294",
    student_table_id: "3072",
    student_id: "IM25STU0003057",
    is_active: true,
    name: "Anuj chitmitwar",
    mobile: "5000000114",
    email: "anujchitmitwar3333@gmail.com",
    father_name: "Ajay chitmitwar",
    mother_name: "Kalpna chitmitwar",
    gender: "Male",
    date_of_birth: "1995-09-25",
    dob: "25 Sep 1995",
    father_contact_number: "9300624264",
    mother_contact_number: "null",
    whatsapp_number: "6260130069",
    parent_email: "null",
    contact_person: "Father",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "Bhatagaon Shivam vihar near chandra town",
    pin_code: "492001",
    latitude: "null",
    longitude: "null",
    city: "Raipur",
    state: "Chhattisgarh",
    class_name: "12th",
    class_id: 38,
    school_name: "Holy cross Byron bazar Raipur",
    education_board: "CBSE",
    tutor_preference: "Male",
    teaching_preference: ["Tutor's Home", "Coaching Center"],
    special_concern: "",
    time_slots_id_list: [11, 16, 17, 21, 22],
    subjects_list: ["Mathematics", "Physics"],
    subject_id_list: [2, 12],
    profile_status: "Completed",
    signup_date: "18 Nov 2025 06:44 PM",
    suitable_days: ["Monday", "Tuesday", "Thursday", "Wednesday", "Saturday", "Friday"],
    hobbies: "",
    landmark: "Shivam vihar bhatagaon",
    class_mode: "Offline",
    counselling_status: "",
  },
  {
    id: 3056,
    user_table_id: "43277",
    student_table_id: "3056",
    student_id: "IM25STU0003041",
    is_active: true,
    name: "Avanthika.P",
    mobile: "9019623046",
    email: null,
    father_name: null,
    mother_name: null,
    gender: "",
    date_of_birth: null,
    dob: null,
    father_contact_number: null,
    mother_contact_number: null,
    whatsapp_number: null,
    parent_email: null,
    contact_person: null,
    contact_person_name: null,
    contact_person_mobile: null,
    address: "",
    pin_code: null,
    latitude: null,
    longitude: null,
    city: null,
    state: null,
    class_name: "",
    class_id: "",
    school_name: null,
    education_board: null,
    tutor_preference: "",
    teaching_preference: [],
    special_concern: "",
    time_slots_id_list: [],
    subjects_list: [],
    subject_id_list: [],
    profile_status: "Incomplete",
    signup_date: "18 Nov 2025 03:04 PM",
    suitable_days: [],
    hobbies: "",
    landmark: null,
    class_mode: [],
    counselling_status: "",
  },
  {
    id: 3055,
    user_table_id: "43276",
    student_table_id: "3055",
    student_id: "IM25STU0003040",
    is_active: true,
    name: "Avanthika.P",
    mobile: "9886997433",
    email: "prashanthpr23@gmail.com",
    father_name: "Prashanth ",
    mother_name: "Meena",
    gender: "Female",
    date_of_birth: "2021-01-26",
    dob: "26 Jan 2021",
    father_contact_number: "9886997433",
    mother_contact_number: "9019623046",
    whatsapp_number: "9886997433",
    parent_email: "null",
    contact_person: "Mother",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "No 33 2nd cross N.C colony bore bank road Benson town post bangalore 46",
    pin_code: "560046",
    latitude: "null",
    longitude: "null",
    city: "Bangalore North",
    state: "Karnataka",
    class_name: "LKG",
    class_id: 11,
    school_name: "clarence kindergarten ",
    education_board: "Icic",
    tutor_preference: "Female",
    teaching_preference: ["My Home"],
    special_concern: "",
    time_slots_id_list: [8],
    subjects_list: ["All Subjects"],
    subject_id_list: [1],
    profile_status: "Completed",
    signup_date: "18 Nov 2025 01:08 PM",
    suitable_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    hobbies: "",
    landmark: "Near ambedkar statue",
    class_mode: [],
    counselling_status: "",
  },
  {
    id: 3054,
    user_table_id: "43267",
    student_table_id: "3054",
    student_id: "IM25STU0003039",
    is_active: true,
    name: "Anshikha",
    mobile: "9663377236",
    email: "ashalka2012@gmail.com",
    father_name: "Ashutosh Dixit",
    mother_name: "Alka Dixit",
    gender: "Female",
    date_of_birth: "2015-04-11",
    dob: "11 Apr 2015",
    father_contact_number: "9663377236",
    mother_contact_number: "7999858746",
    whatsapp_number: "9663377236",
    parent_email: "null",
    contact_person: "Father",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "K-206, Sri Tirumala Sarovar, Singasandra, Hosur Road, Bangalore",
    pin_code: "560068",
    latitude: "12.8788991",
    longitude: "77.6475324",
    city: "Bangalore South",
    state: "Karnataka",
    class_name: "5th",
    class_id: 31,
    school_name: "Sri Chaitanya Techno school",
    education_board: "cbse",
    tutor_preference: "Female",
    teaching_preference: ["My Home"],
    special_concern: "English reading and writing issues due to phonics. ",
    time_slots_id_list: [8],
    subjects_list: ["All Subjects"],
    subject_id_list: [1],
    profile_status: "Completed",
    signup_date: "17 Nov 2025 01:24 PM",
    suitable_days: ["Monday", "Tuesday", "Thursday", "Friday"],
    hobbies: "painting and outdoor sports",
    landmark: "Adjacent to KIA showroom hosur road, singasandra",
    class_mode: "Offline",
    counselling_status: "",
  },
  {
    id: 3042,
    user_table_id: "43254",
    student_table_id: "3042",
    student_id: "IM25STU0003027",
    is_active: true,
    name: "Anu",
    mobile: "7838816675",
    email: null,
    father_name: null,
    mother_name: null,
    gender: "",
    date_of_birth: null,
    dob: null,
    father_contact_number: null,
    mother_contact_number: null,
    whatsapp_number: null,
    parent_email: null,
    contact_person: null,
    contact_person_name: null,
    contact_person_mobile: null,
    address: "",
    pin_code: null,
    latitude: null,
    longitude: null,
    city: null,
    state: null,
    class_name: "",
    class_id: "",
    school_name: null,
    education_board: null,
    tutor_preference: "",
    teaching_preference: [],
    special_concern: "",
    time_slots_id_list: [],
    subjects_list: [],
    subject_id_list: [],
    profile_status: "Incomplete",
    signup_date: "16 Nov 2025 06:27 PM",
    suitable_days: [],
    hobbies: "",
    landmark: null,
    class_mode: [],
    counselling_status: "",
  },
  {
    id: 3040,
    user_table_id: "43252",
    student_table_id: "3040",
    student_id: "IM25STU0003025",
    is_active: true,
    name: "Trishika Wasnik ",
    mobile: "7000080950",
    email: "jai.bhavani@icloud.com",
    father_name: "Dinker Wasnik ",
    mother_name: "Aditi Wasnik ",
    gender: "Female",
    date_of_birth: "2015-09-01",
    dob: "01 Sep 2015",
    father_contact_number: "7000080950",
    mother_contact_number: "9827992200",
    whatsapp_number: "9827992200",
    parent_email: "null",
    contact_person: "Father",
    contact_person_name: null,
    contact_person_mobile: null,
    address:
      "Flat no. B -505, Block - B , Avenue 144, New Rajendra Nagar, Amlidih, Raipur, Chhattisgarh.",
    pin_code: "492001",
    latitude: "null",
    longitude: "null",
    city: "Raipur",
    state: "Chhattisgarh",
    class_name: "5th",
    class_id: 31,
    school_name: "DPS Raipur ",
    education_board: "CBSE",
    tutor_preference: "Any",
    teaching_preference: ["My Home"],
    special_concern: "Competitive exam particularly for Sainik school entrance exam. ",
    time_slots_id_list: [8],
    subjects_list: ["All Subjects"],
    subject_id_list: [1],
    profile_status: "Active",
    signup_date: "16 Nov 2025 02:40 PM",
    suitable_days: ["Monday", "Tuesday", "Wednesday", "Saturday", "Friday", "Thursday"],
    hobbies: "Drawing ",
    landmark: "Near Medishine Hospital / Dronacharya public school ",
    class_mode: "Offline",
    counselling_status: "",
  },
  {
    id: 3026,
    user_table_id: "43230",
    student_table_id: "3026",
    student_id: "IM25STU0003011",
    is_active: true,
    name: "Sameer Singh Rajput",
    mobile: "8871631029",
    email: "sameersinghmsp@gmail.com",
    father_name: "Amitesh Singh",
    mother_name: "Mini singh",
    gender: "Male",
    date_of_birth: "2007-04-11",
    dob: "11 Apr 2007",
    father_contact_number: "9098931029",
    mother_contact_number: "9109823068",
    whatsapp_number: "8871631029",
    parent_email: "null",
    contact_person: "Father",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "D block 301 shilp ganga apartment, maitri kunj bhilai",
    pin_code: "490006",
    latitude: "null",
    longitude: "null",
    city: "Bhilai",
    state: "Chhattisgarh",
    class_name: "B Com",
    class_id: 47,
    school_name: "Shankara university ",
    education_board: "B.com",
    tutor_preference: "Any",
    teaching_preference: ["My Home"],
    special_concern: "1st semster b.com",
    time_slots_id_list: [7],
    subjects_list: ["Accountancy"],
    subject_id_list: [16],
    profile_status: "Completed",
    signup_date: "14 Nov 2025 02:47 PM",
    suitable_days: ["Monday", "Friday", "Wednesday", "Tuesday", "Thursday", "Saturday"],
    hobbies: "",
    landmark: "Near ashirwad bhagwan ",
    class_mode: "Offline",
    counselling_status: "",
  },
  {
    id: 3025,
    user_table_id: "43229",
    student_table_id: "3025",
    student_id: "IM25STU0003010",
    is_active: true,
    name: "Pragyan Meshram ",
    mobile: "9406289222",
    email: "Praggya1981@gmail.com",
    father_name: "G. C Meshram ",
    mother_name: "Praggya M Wasnik",
    gender: "Male",
    date_of_birth: "2014-12-21",
    dob: "21 Dec 2014",
    father_contact_number: "9425223282",
    mother_contact_number: "9406289222",
    whatsapp_number: "9406289222",
    parent_email: "null",
    contact_person: "Mother",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "Bk1 Street 14 sector 9\nBhilai \nDistrict Durg \nchhattisgarh ",
    pin_code: "490006",
    latitude: "19.033145446865447",
    longitude: "81.92849585645193",
    city: "Bhilai",
    state: "Chhattisgarh",
    class_name: "5th",
    class_id: 31,
    school_name: "Dps Bhilai ",
    education_board: "CBSC",
    tutor_preference: "Any",
    teaching_preference: ["My Home"],
    special_concern: "Sainik school entrance exam ",
    time_slots_id_list: [7],
    subjects_list: ["All Subjects"],
    subject_id_list: [1],
    profile_status: "Active",
    signup_date: "14 Nov 2025 02:39 PM",
    suitable_days: [],
    hobbies: "football ",
    landmark: "Panthi chowk ",
    class_mode: "Offline",
    counselling_status: "",
  },
  {
    id: 3024,
    user_table_id: "43225",
    student_table_id: "3024",
    student_id: "IM25STU0003009",
    is_active: true,
    name: "Advik Dewangan ",
    mobile: "9179532524",
    email: null,
    father_name: null,
    mother_name: null,
    gender: "",
    date_of_birth: null,
    dob: null,
    father_contact_number: null,
    mother_contact_number: null,
    whatsapp_number: null,
    parent_email: null,
    contact_person: null,
    contact_person_name: null,
    contact_person_mobile: null,
    address: "",
    pin_code: null,
    latitude: null,
    longitude: null,
    city: null,
    state: null,
    class_name: "",
    class_id: "",
    school_name: null,
    education_board: null,
    tutor_preference: "",
    teaching_preference: [],
    special_concern: "",
    time_slots_id_list: [],
    subjects_list: [],
    subject_id_list: [],
    profile_status: "Incomplete",
    signup_date: "13 Nov 2025 03:37 PM",
    suitable_days: [],
    hobbies: "",
    landmark: null,
    class_mode: [],
    counselling_status: "",
  },
  {
    id: 3023,
    user_table_id: "43224",
    student_table_id: "3023",
    student_id: "IM25STU0003008",
    is_active: true,
    name: "Advik Dewangan ",
    mobile: "9179532525",
    email: "jitudewangan2525@gmail.com",
    father_name: "Jitendra Kumar Dewangan",
    mother_name: "Jyoti Dewangan",
    gender: "Male",
    date_of_birth: "2016-01-25",
    dob: "25 Jan 2016",
    father_contact_number: "9179532525",
    mother_contact_number: "null",
    whatsapp_number: "9179532525",
    parent_email: "null",
    contact_person: "Father",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "Shiva Vihar Ward - 58, Baimanagoi Road, Khamtarai, Bilaspur ",
    pin_code: "495006",
    latitude: "21.2140032",
    longitude: "81.3268992",
    city: "Bilaspur",
    state: "Chhattisgarh",
    class_name: "5th",
    class_id: 31,
    school_name: "brilliant public school ",
    education_board: "CBSE",
    tutor_preference: "Female",
    teaching_preference: ["My Home"],
    special_concern: "Tutors must be experienced.",
    time_slots_id_list: [8, 11],
    subjects_list: ["All Subjects"],
    subject_id_list: [1],
    profile_status: "Active",
    signup_date: "13 Nov 2025 03:24 PM",
    suitable_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    hobbies: "",
    landmark: "Baimanagoi Road",
    class_mode: "Offline",
    counselling_status: "",
  },
  {
    id: 3022,
    user_table_id: "43221",
    student_table_id: "3022",
    student_id: "IM25STU0003007",
    is_active: true,
    name: "MADHUR AGRAWAL",
    mobile: "9893362395",
    email: "agrawalmadhur500@gmail.com",
    father_name: "Sanjay agrawal",
    mother_name: "Ekta agrawal",
    gender: "Male",
    date_of_birth: "2010-02-28",
    dob: "28 Feb 2010",
    father_contact_number: "9131710199",
    mother_contact_number: "7869496871",
    whatsapp_number: "9893362395",
    parent_email: "null",
    contact_person: "Mother",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "Mahesh colony gali no.1",
    pin_code: "492008",
    latitude: "21.2682493",
    longitude: "81.6312503",
    city: "Raipur",
    state: "Chhattisgarh",
    class_name: "10th",
    class_id: 36,
    school_name: "GYAN GANGA EDUCATIONAL ACADEMY NARDAHA RAIPUR CG",
    education_board: "CBSE",
    tutor_preference: "Male",
    teaching_preference: ["My Home"],
    special_concern: "",
    time_slots_id_list: [15],
    subjects_list: ["Mathematics", "Science", "Social Science"],
    subject_id_list: [2, 4, 5],
    profile_status: "Completed",
    signup_date: "13 Nov 2025 01:37 PM",
    suitable_days: ["Monday", "Wednesday", "Friday", "Tuesday", "Thursday", "Saturday"],
    hobbies: "",
    landmark: "Mahesh colony sri nagar road gudhyari raipur",
    class_mode: "Offline",
    counselling_status: "",
  },
  {
    id: 3021,
    user_table_id: "43219",
    student_table_id: "3021",
    student_id: "IM25STU0003006",
    is_active: true,
    name: "Nivaan",
    mobile: "9827624464",
    email: "yogeshchandel017@gmail.com",
    father_name: "Rohit chandel ",
    mother_name: "Harshpriya ",
    gender: "Male",
    date_of_birth: "2018-04-05",
    dob: "05 Apr 2018",
    father_contact_number: "9827624464",
    mother_contact_number: "9827624464",
    whatsapp_number: "9827624464",
    parent_email: "null",
    contact_person: "Father",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "Rohit chandel house 64 Surandra manik Coloney Awadpuri bhopal ",
    pin_code: "462023",
    latitude: "null",
    longitude: "null",
    city: "Huzur",
    state: "Madhya Pradesh",
    class_name: "2nd",
    class_id: 28,
    school_name: "SPS ",
    education_board: "Cbsc",
    tutor_preference: "Female",
    teaching_preference: ["My Home"],
    special_concern: "",
    time_slots_id_list: [11],
    subjects_list: ["All Subjects"],
    subject_id_list: [1],
    profile_status: "Completed",
    signup_date: "13 Nov 2025 12:38 PM",
    suitable_days: ["Monday", "Tuesday", "Wednesday", "Saturday", "Friday", "Thursday"],
    hobbies: "Cricket ",
    landmark: "Surandra manik colony Awadpuri bhopal",
    class_mode: "Offline",
    counselling_status: "",
  },
  {
    id: 3020,
    user_table_id: "43216",
    student_table_id: "3020",
    student_id: "IM25STU0003005",
    is_active: true,
    name: "Rajosree Dey",
    mobile: "5000000113",
    email: "rajosreedey69@gmail.com",
    father_name: "Jishu kanta dey",
    mother_name: "Rinku Dey",
    gender: "Female",
    date_of_birth: "1998-02-09",
    dob: "09 Feb 1998",
    father_contact_number: "8473909196",
    mother_contact_number: "8473909196",
    whatsapp_number: "8811981686",
    parent_email: "null",
    contact_person: "Father",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "",
    pin_code: null,
    latitude: null,
    longitude: null,
    city: null,
    state: null,
    class_name: "",
    class_id: "",
    school_name: null,
    education_board: null,
    tutor_preference: "",
    teaching_preference: [],
    special_concern: "",
    time_slots_id_list: [],
    subjects_list: [],
    subject_id_list: [],
    profile_status: "Incomplete",
    signup_date: "13 Nov 2025 11:41 AM",
    suitable_days: [],
    hobbies: "",
    landmark: null,
    class_mode: [],
    counselling_status: "",
  },
  {
    id: 3019,
    user_table_id: "43204",
    student_table_id: "3019",
    student_id: "IM25STU0003004",
    is_active: true,
    name: "Sandeep Kumar",
    mobile: "5000000112",
    email: "sandeep.dubay14@gmail.com",
    father_name: "Arun kumar",
    mother_name: "Meena",
    gender: "Male",
    date_of_birth: "1995-09-12",
    dob: "12 Sep 1995",
    father_contact_number: "8305455518",
    mother_contact_number: "6261938778",
    whatsapp_number: "7999806234",
    parent_email: "null",
    contact_person: "Mother",
    contact_person_name: null,
    contact_person_mobile: null,
    address: "Post-khatakoni, vill- Bhilauni, bilaspur c.g.\n",
    pin_code: "495001",
    latitude: "22.133179862890806",
    longitude: "82.01198832942367",
    city: "Bilaspur",
    state: "Chhattisgarh",
    class_name: "",
    class_id: "",
    school_name: null,
    education_board: null,
    tutor_preference: "",
    teaching_preference: [],
    special_concern: "",
    time_slots_id_list: [],
    subjects_list: [],
    subject_id_list: [],
    profile_status: "Incomplete",
    signup_date: "11 Nov 2025 10:15 PM",
    suitable_days: [],
    hobbies: "",
    landmark: "Shiv mandir Bhilauni ",
    class_mode: [],
    counselling_status: "",
  },
];

// Fetch students from API (placeholder - implement actual API call)
const fetchStudents = async () => {
  loading.value = true;
  try {
    // TODO: Replace with actual API endpoint
    // const response = await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/students`);
    // studentList.value = response.student_list || [];

    // Using sample data for now
    studentList.value = sampleData;
  } catch (error) {
    console.error("Error fetching students:", error);
  } finally {
    loading.value = false;
  }
};

// Filtered students based on search
const filteredStudents = computed(() => {
  if (!searchQuery.value) return studentList.value;

  const query = searchQuery.value.toLowerCase();
  return studentList.value.filter(
    (student) =>
      student.name.toLowerCase().includes(query) ||
      student.student_id.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.mobile.includes(query) ||
      student.city.toLowerCase().includes(query)
  );
});

onMounted(() => {
  fetchStudents();
});
</script>

<template>
  <v-container fluid>
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center flex-wrap gap-4">
          <div>
            <h1 class="text-h4 mb-2">Student List</h1>
            <p class="text-body-2 text-medium-emphasis">
              Manage and view all student profiles
            </p>
          </div>
          <v-btn color="primary" prepend-icon="mdi-plus" size="large">
            Add New Student
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Search and Filter Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search students..."
          variant="outlined"
          clearable
          hide-details
        >
          <template v-slot:prepend-inner>
            <div class="text-lightText d-flex align-center">
              <SvgSprite name="custom-search" style="width: 16px; height: 16px" />
            </div>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="8" class="justify-end d-flex pr-0">
        <slot name="tableController">
          <v-btn
            class="hidden-md-and-down mr-2 ml-0"
            color="primary"
            :icon="mdiTuneVariant"
            aria-label="sidebar button"
            rounded="sm"
            variant="tonal"
          >
          </v-btn>
          <v-btn
            class="hidden-md-and-down mr-5 ml-0"
            color="primary"
            aria-label="sidebar button"
            rounded="sm"
            variant="tonal"
            :icon="mdiTrayArrowDown"
          >
          </v-btn>
        </slot>
      </v-col>
    </v-row>
    <!--  -->

    <div>
      <v-btn-toggle v-model="tab" border color="primary" variant="text">
        <v-btn value="table" :icon="mdiTableLarge"></v-btn>
        <v-btn value="list" :icon="mdiListBoxOutline"></v-btn>
        <v-btn value="card" :icon="mdiAccountBoxOutline"></v-btn>
      </v-btn-toggle>
    </div>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="'table'">
        <DataTable
          :headers="headers"
          :items="sampleData"
          total-items="20"
          :loading="loading"
          items-per-page="20"
          :search="searchQuery"
          item-value="user_table_id"
          search-placeholder="Search students..."
          no-data-message="No students found. Try adjusting your search criteria or add your first student."
        >
          <!-- @update:items-per-page="(v) => (itemsPerPage = v)"
          @update:search="(v) => (searchQuery = v)"
          @action="handleAction" -->
          <template #item.class_name="{ item }">
            <div>
              <div class="text-body-2 font-weight-medium">{{ item.class_name }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ item.education_board?.toUpperCase() || "" }}
              </div>
            </div>
          </template>
        </DataTable>
      </v-tabs-window-item>
      <v-tabs-window-item :value="'list'">
        <!-- Profile list UI -->
        <div v-for="data in sampleData">
          <ProfileList :config="profileListConfig" :data="data">
            <template #actionBtn="{ item, con }">
              <div class="mb-3 text-right">
                <v-btn width="x-small" color="primary" variant="outlined">
                  visit Profile
                </v-btn>
              </div>
            </template>
          </ProfileList>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="'card'">
        <!-- Profile card UI -->
        <v-row class="" no-gutters>
          <v-col cols="12" md="4" class="pa-1" v-for="data in sampleData">
            <ProfileCard :config="profileCardConfig" :data="data">
              <template #classAndBoard="{ item, con }">
                <div class="">
                  <div class="text-caption text-medium-emphasis mb-1">Class & board</div>
                  <div class="text-subtitle-2 text-truncate">
                    {{ item.class_name }} - {{ item.education_board?.toUpperCase() }}
                  </div>
                </div>
              </template>

              <template #actionBtn="{ item, con }">
                <div class="mb-3">
                  <v-btn width="x-small" color="primary" variant="outlined" block>
                    visit Profile</v-btn
                  >
                </div>
              </template>
            </ProfileCard>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>

    <!--  -->

    <!--  -->
  </v-container>
</template>

<style scoped lang="scss"></style>
