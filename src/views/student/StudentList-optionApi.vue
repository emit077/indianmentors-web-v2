<style scoped></style>
<template>
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
  <DataTable
    :headers="headers"
    :items="serverItems"
    :total-items="totalItems"
    :loading="loading"
    :items-per-page="itemsPerPage"
    :search="searchQuery"
    item-value="user_table_id"
    search-placeholder="Search students..."
    no-data-message="No students found. Try adjusting your search criteria or add your first student."
    @update:items-per-page="(v) => (itemsPerPage = v)"
    @update:search="(v) => (searchQuery = v)"
    @action="handleAction"
  >
    <template #item.class_name="{ item }">
      <div>
        <div class="text-body-2 font-weight-medium">{{ item.class_name }}</div>
        <div class="text-caption text-medium-emphasis">
          {{ item.education_board?.toUpperCase() || "" }}
        </div>
      </div>
    </template>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";
import DataTable, { type TableHeader, type TableOptions } from "@/components/datatable/DataTable.vue";

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

export default defineComponent({
  name: "StudentList",
  components: {
    DataTable,
  },
  data() {
    return {
      studentList: [] as Student[],
      serverItems: [] as Student[],
      loading: false,
      searchQuery: "",
      search: "",
      itemsPerPage: 10,
      totalItems: 0,

      headers: [
        { title: "Stu ID", key: "student_id", sortable: true, maxWidth: "65px" },
        { title: "Student Info", key: "student", sortable: true, align: "start", formate_type: "" },
        { title: "Class & Board", key: "class_name", sortable: true, formate_type: "custome" },
        { title: "Location", key: "city", sortable: true },
        { title: "Status", key: "profile_status", sortable: true, formate_type: "chips-solid" },
        { title: "Signup Date", key: "signup_date", sortable: true, maxWidth: "80px" },
        { title: "Actions", key: "DT_BTNS", sortable: false, align: "end" },
      ] as TableHeader[],

      sampleData: [] as Student[],
    };
  },
  computed: {
    filteredStudents(): Student[] {
      if (!this.searchQuery) return this.studentList;
      const q = this.searchQuery.toLowerCase();
      return this.studentList.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.student_id.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.mobile.includes(q) ||
          s.city.toLowerCase().includes(q)
      );
    },
  },
  watch: {
    searchQuery() {
      this.search = String(Date.now());
    },
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    handleAction(action: string, item: Student, data?: any) {
      console.log("Action:", action, item, data);
    },

    handleDelete(student: Student) {
      console.log("Delete student:", student);
    },

    loadItems(options: TableOptions) {
      this.loading = true;
      this.fetchFromAPI({
        page: options.page,
        itemsPerPage: options.itemsPerPage,
        sortBy: options.sortBy,
        search: { query: this.searchQuery },
      }).then(({ items, total }) => {
        this.serverItems = items;
        this.totalItems = total;
        this.loading = false;
      });
    },

    async fetchFromAPI({
      page,
      itemsPerPage,
      sortBy,
      search,
    }: {
      page: number;
      itemsPerPage: number;
      sortBy: { key: string; order: "asc" | "desc" }[];
      search: { query: string };
    }) {
      return new Promise<{ items: Student[]; total: number }>((resolve) => {
        setTimeout(() => {
          let items = [...this.studentList];

          if (search.query) {
            const query = search.query.toLowerCase();
            items = items.filter(
              (item) =>
                item.name.toLowerCase().includes(query) ||
                item.student_id.toLowerCase().includes(query) ||
                item.email.toLowerCase().includes(query) ||
                item.mobile.includes(query) ||
                item.city.toLowerCase().includes(query)
            );
          }

          if (sortBy.length) {
            const sortKey = sortBy[0].key;
            const sortOrder = sortBy[0].order;
            items.sort((a: any, b: any) => {
              const aVal = a[sortKey];
              const bVal = b[sortKey];
              if (typeof aVal === "string") {
                return sortOrder === "desc"
                  ? bVal.localeCompare(aVal)
                  : aVal.localeCompare(bVal);
              }
              return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
            });
          }

          const start = (page - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          resolve({ items: items.slice(start, end), total: items.length });
        }, 300);
      });
    },

    async fetchStudents() {
      this.loading = true;

      this.studentList = this.sampleData;
      this.totalItems = this.sampleData.length;

      this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage, sortBy: [] });
    },
  },
});
</script>
