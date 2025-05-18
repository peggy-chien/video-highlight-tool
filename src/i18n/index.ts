import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import yaml from 'js-yaml';
import type { TranslationSchema } from './types';

// Import YAML files as raw text
import enYaml from './locales/en.yml?raw';
import zhTWYaml from './locales/zh-TW.yml?raw';

// Parse YAML to JavaScript objects
const en = yaml.load(enYaml) as TranslationSchema;
const zhTW = yaml.load(zhTWYaml) as TranslationSchema;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      'zh-TW': {
        translation: zhTW
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 