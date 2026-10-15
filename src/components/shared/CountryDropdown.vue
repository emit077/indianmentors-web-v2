<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { mdiChevronDown } from '@mdi/js';
import { useCountryStore, type CountryOption } from '@/stores/country';

const countryStore = useCountryStore();
const menuOpen = ref(false);
const countryQuery = ref('');

const filteredCountries = computed(() => {
  const query = countryQuery.value.trim().toLowerCase();
  if (!query) return countryStore.countries;
  return countryStore.countries.filter((country) => {
    const dialingDigits = country.dialing_code.replace(/\D/g, '');
    const dialingQuery = query.replace(/\D/g, '');
    return (
      country.country_name.toLowerCase().includes(query) ||
      country.abbreviation.toLowerCase().includes(query) ||
      country.dialing_code.toLowerCase().includes(query) ||
      (dialingQuery.length > 0 && dialingDigits.includes(dialingQuery))
    );
  });
});

function countryFlagIcon(abbreviation: string) {
  const code = abbreviation?.trim().toLowerCase() === 'uk' ? 'gb' : abbreviation?.trim().toLowerCase() ?? '';
  if (!/^[a-z]{2}$/.test(code)) return '';
  return `flag:${code}-4x3`;
}

function selectCountry(country: CountryOption) {
  countryStore.select(country);
  menuOpen.value = false;
}

function selectFirstMatch() {
  const match = filteredCountries.value[0];
  if (match) selectCountry(match);
}

watch(menuOpen, (open) => {
  if (open) countryQuery.value = '';
});

onMounted(() => {
  countryStore.load();
});
</script>

<template>
  <v-menu v-model="menuOpen" location="bottom end" :close-on-content-click="false" offset="8" width="300">
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        variant="text"
        rounded="md"
        class="country-appbar-btn text-none px-2"
        :loading="countryStore.loading"
        :aria-label="countryStore.selected ? `Country, ${countryStore.selected.country_name}` : 'Choose country'"
      >
        <span v-if="countryStore.selected" class="d-inline-flex align-center">
          <span v-if="countryFlagIcon(countryStore.selected.abbreviation)" class="country-flag">
            <Icon :icon="countryFlagIcon(countryStore.selected.abbreviation)" class="h-full" />
          </span>
          <span class="country-name text-body-2 font-weight-medium ml-2 d-none d-sm-inline">
            {{ countryStore.selected.country_name }}
          </span>
        </span>
        <span v-else class="text-body-2">Country</span>
        <v-icon :icon="mdiChevronDown" size="18" class="ml-1" />
      </v-btn>
    </template>

    <v-card rounded="lg" elevation="2">
      <div class="pa-3 pb-2">
        <v-text-field
          v-model="countryQuery"
          placeholder="Search country"
          aria-label="Search country"
          density="comfortable"
          variant="outlined"
          hide-details
          color="primary"
          autofocus
          autocomplete="off"
          @mousedown.stop
          @click.stop
          @keydown.enter.prevent="selectFirstMatch"
        />
      </div>
      <v-list v-if="filteredCountries.length" density="compact" max-height="280" class="overflow-y-auto py-1">
        <v-list-item
          v-for="country in filteredCountries"
          :key="country.id"
          :active="country.id === countryStore.selectedId"
          color="primary"
          @click="selectCountry(country)"
        >
          <template #prepend>
            <span class="country-flag mr-3">
              <Icon :icon="countryFlagIcon(country.abbreviation)" class="h-full" />
            </span>
          </template>
          <v-list-item-title>{{ country.country_name }}</v-list-item-title>
          <template #append>
            <span class="text-body-2 text-medium-emphasis text-no-wrap ms-4">{{ country.dialing_code }}</span>
          </template>
        </v-list-item>
      </v-list>
      <div v-else class="px-3 py-4 text-center">
        <p class="text-body-2 text-medium-emphasis mb-2">
          {{ countryStore.loadError || 'No countries found' }}
        </p>
        <v-btn v-if="countryStore.loadError" variant="text" color="primary" @click="countryStore.load()">Try again</v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<style scoped>
.country-appbar-btn {
  min-height: 40px;
}

.country-flag {
  width: 20px;
  height: 15px;
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 2px;
  overflow: hidden;
}

.country-name {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.h-full {
  width: 100%;
  height: 100%;
}
</style>
