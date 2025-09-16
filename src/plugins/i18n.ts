import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import hi from '@/locales/hi.json'
import es from '@/locales/es.json'
import fr from '@/locales/fr.json'

// Type-define 'en' as the master schema for the resource
type MessageSchema = typeof en

// Get saved language preference or default to 'en'
const savedLanguage = localStorage.getItem('preferred-language') || 'en'

const i18n = createI18n<[MessageSchema], 'en' | 'hi' | 'es' | 'fr'>({
  legacy: false, // you must set `false`, to use Composition API
  locale: savedLanguage as 'en' | 'hi' | 'es' | 'fr', // set locale from saved preference
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en,
    hi,
    es,
    fr
  }
})

export default i18n
