import { defineStore } from 'pinia';
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

const STORAGE_KEY = 'selected_country_id';

function readStoredId(): number | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const useCountryStore = defineStore({
  id: 'country',
  state: () => ({
    countries: [] as CountryOption[],
    selectedId: readStoredId(),
    loading: false,
    loadError: ''
  }),
  getters: {
    selected(state): CountryOption | null {
      return state.countries.find((country) => country.id === state.selectedId) ?? null;
    }
  },
  actions: {
    async load() {
      if (this.countries.length || this.loading) return;
      this.loading = true;
      this.loadError = '';
      try {
        const data = (await api.get(URLS.COUNTRIES)) as CountryOption[];
        const countries = (Array.isArray(data) ? data : []).filter((country) => country.is_active !== false);
        this.countries = countries;
        const stored = countries.find((country) => country.id === this.selectedId);
        const india = countries.find((country) => country.abbreviation === 'IN');
        const next = stored ?? india ?? countries[0] ?? null;
        if (next) this.select(next);
      } catch {
        this.loadError = 'Could not load countries.';
      } finally {
        this.loading = false;
      }
    },
    select(country: CountryOption) {
      this.selectedId = country.id;
      localStorage.setItem(STORAGE_KEY, String(country.id));
    }
  }
});
