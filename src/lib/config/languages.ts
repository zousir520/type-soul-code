// 支持的语言配置
export const SUPPORTED_LANGUAGES = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  zh: {
    name: '中文',
    flag: '🇨🇳',
    dir: 'ltr'
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    dir: 'ltr'
  },
  jp: {
    name: '日本語',
    flag: '🇯🇵',
    dir: 'ltr'
  }
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return lang in SUPPORTED_LANGUAGES;
}

export function getLanguageConfig(lang: string) {
  if (isValidLanguage(lang)) {
    return SUPPORTED_LANGUAGES[lang];
  }
  return SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];
}

export function getAllLanguages() {
  return Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[];
}