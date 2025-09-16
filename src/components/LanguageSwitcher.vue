<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="text"
        prepend-icon="mdi-translate"
        class="text-none"
      >
        {{ currentLanguageName }}
      </v-btn>
    </template>
    
    <v-list>
      <v-list-item
        v-for="(language, code) in languages"
        :key="code"
        :value="code"
        @click="changeLanguage(code)"
        :active="locale === code"
      >
        <template v-slot:prepend>
          <v-icon>{{ getLanguageIcon(code) }}</v-icon>
        </template>
        <v-list-item-title>{{ language }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const languages = {
  en: t('LANGUAGES.ENGLISH'),
  hi: t('LANGUAGES.HINDI'),
  es: t('LANGUAGES.SPANISH'),
  fr: t('LANGUAGES.FRENCH')
}

const currentLanguageName = computed(() => {
  return languages[locale.value as keyof typeof languages] || languages.en
})

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('preferred-language', lang)
}

const getLanguageIcon = (code: string) => {
  const icons: Record<string, string> = {
    en: 'mdi-flag',
    hi: 'mdi-flag',
    es: 'mdi-flag',
    fr: 'mdi-flag'
  }
  return icons[code] || 'mdi-flag-outline'
}
</script>
