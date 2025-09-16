import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref(localStorage.getItem('preferred-language') || 'en')

  const setLanguage = (language: string) => {
    currentLanguage.value = language
    localStorage.setItem('preferred-language', language)
  }

  const getLanguage = () => {
    return currentLanguage.value
  }

  return {
    currentLanguage,
    setLanguage,
    getLanguage
  }
})
