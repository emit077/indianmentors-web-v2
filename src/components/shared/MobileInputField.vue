<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { mdiChevronDown } from '@mdi/js';
import { api } from '@/utils/api/axios';
import URLS from '@/utils/urls';

export interface CountryOption {
    id: number;
    country_name: string;
    dialing_code: string;
    abbreviation: string;
    is_active: boolean;
    max_length: number;
    time_zone: string;
}

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        countryId?: number | null;
        dialingCode?: string;
        label?: string;
        placeholder?: string;
        rules?: Array<(value: string) => boolean | string>;
        required?: boolean;
    }>(),
    {
        modelValue: '',
        countryId: null,
        dialingCode: '',
        label: 'Mobile',
        placeholder: '9876543210',
        required: true
    }
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    'update:countryId': [value: number | null];
    'update:dialingCode': [value: string];
}>();

const countries = ref<CountryOption[]>([]);
const loading = ref(false);
const loadError = ref('');
const menuOpen = ref(false);
const countryQuery = ref('');

const selectedCountry = computed(
    () => countries.value.find((country) => country.id === props.countryId) ?? null
);

const selectedFlag = computed(() =>
    selectedCountry.value ? countryFlagIcon(selectedCountry.value.abbreviation) : ''
);

const selectedCode = computed(() => selectedCountry.value?.dialing_code || props.dialingCode);

const mobileMaxLength = computed(() => {
    const length = selectedCountry.value?.max_length;
    return typeof length === 'number' && length > 0 ? length : 15;
});

const fieldRules = computed(() => props.rules ?? defaultRules());

const filteredCountries = computed(() => {
    const query = countryQuery.value.trim().toLowerCase();
    if (!query) return countries.value;
    return countries.value.filter((country) => {
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

function defaultRules() {
    return [
        (value: string) => !props.required || !!value || `${props.label} is required`,
        (value: string) => {
            if (!value) return true;
            const max = mobileMaxLength.value;
            const min = Math.min(6, max);
            if (value.length >= min && value.length <= max) return true;
            return min === max ? `Enter ${max} digits` : `Enter ${min}–${max} digits`;
        }
    ];
}

function countryFlagIcon(abbreviation: string) {
    const code = abbreviation?.trim().toLowerCase() ?? '';
    if (!/^[a-z]{2}$/.test(code)) return '';
    return `flag:${code}-4x3`;
}

function onMobileInput(value: string) {
    emit('update:modelValue', value.replace(/\D/g, '').slice(0, mobileMaxLength.value));
}

function selectCountry(country: CountryOption) {
    emit('update:countryId', country.id);
    emit('update:dialingCode', country.dialing_code);
    menuOpen.value = false;
}

function selectFirstMatch() {
    const match = filteredCountries.value[0];
    if (match) selectCountry(match);
}

watch(menuOpen, (open) => {
    if (open) countryQuery.value = '';
});

watch(mobileMaxLength, (max) => {
    if (props.modelValue.length > max) {
        emit('update:modelValue', props.modelValue.slice(0, max));
    }
});

onMounted(async () => {
    loading.value = true;
    loadError.value = '';
    try {
        const data = (await api.get(URLS.COUNTRIES)) as CountryOption[];
        countries.value = (Array.isArray(data) ? data : []).filter((country) => country.is_active);
        if (props.countryId == null && countries.value.length) {
            const india = countries.value.find((country) => country.abbreviation === 'IN');
            selectCountry(india ?? countries.value[0]);
        }
    } catch {
        loadError.value = 'Could not load country codes.';
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div>
        <!-- <v-label v-if="label" class="mb-1 text-body-2">{{ label }}</v-label> -->
        <v-text-field :model-value="modelValue" :placeholder="placeholder" :rules="fieldRules" :aria-label="label"
            density="comfortable" :required="required" hide-details variant="outlined" color="primary" type="tel"
            inputmode="numeric" :maxlength="mobileMaxLength" autocomplete="tel"
            @update:model-value="onMobileInput">
            <template #prepend-inner>
                <v-menu v-model="menuOpen" location="bottom start" :close-on-content-click="false" width="300">
                    <template #activator="{ props: menuProps }">
                        <v-btn v-bind="menuProps" type="button" variant="text" rounded="0"
                            class="country-code-btn pl-0 px-1" :loading="loading"
                            :disabled="loading || !countries.length"
                            :aria-label="selectedCountry ? `${selectedCountry.country_name} ${selectedCode}` : 'Choose country code'">
                            <span
                                class="text-body-2 font-weight-medium text-medium-emphasis d-inline-flex align-center">
                                <span v-if="selectedFlag" class="country-flag mr-1">
                                    <Icon :icon="selectedFlag" class="h-full" />
                                </span>
                                {{ selectedCode || 'Code' }}
                            </span>
                            <v-icon :icon="mdiChevronDown" size="18" class="ml-1" />
                        </v-btn>
                    </template>

                    <v-card rounded="lg" elevation="2">
                        <div class="pa-3 pb-2">
                            <v-text-field v-model="countryQuery" placeholder="Search country"
                                aria-label="Search country" density="comfortable" variant="outlined" hide-details
                                color="primary" autofocus autocomplete="off" @mousedown.stop @click.stop
                                @keydown.enter.prevent="selectFirstMatch" />
                        </div>
                        <v-list v-if="filteredCountries.length" density="compact" max-height="240"
                            class="overflow-y-auto py-1">
                            <v-list-item v-for="country in filteredCountries" :key="country.id"
                                :active="country.id === countryId" color="primary" @click="selectCountry(country)">
                                <template #prepend>
                                    <span class="country-flag mr-3">
                                        <Icon :icon="countryFlagIcon(country.abbreviation)" class="h-full" />
                                    </span>
                                </template>
                                <v-list-item-title>{{ country.country_name }}</v-list-item-title>
                                <template #append>
                                    <span class="text-body-2 text-medium-emphasis text-no-wrap ms-4">{{
                                        country.dialing_code }}</span>
                                </template>
                            </v-list-item>
                        </v-list>
                        <p v-else class="text-body-2 text-medium-emphasis text-center px-3 py-4 mb-0">No countries found
                        </p>
                    </v-card>
                </v-menu>
            </template>
        </v-text-field>
        <p v-if="loadError" class="text-caption text-error mt-1 mb-0">{{ loadError }}</p>
    </div>
</template>

<style scoped>
.country-code-btn {
    min-width: 80px;
    height: 32px;
    border-right: 1px solid rgb(var(--v-theme-borderLight));
}

.country-flag {
    width: 20px;
    height: 15px;
    display: inline-flex;
    flex-shrink: 0;
    border-radius: 2px;
    overflow: hidden;
}

.h-full {
    width: 100%;
    height: 100%;
}
</style>
