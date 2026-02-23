import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importamos los dos diccionarios que acabás de crear
import global_es from './locales/es/global.json';
import global_en from './locales/en/global.json';

i18n
  .use(LanguageDetector) // Esto detecta el idioma del navegador de la persona
  .use(initReactI18next) // Esto lo conecta con React
  .init({
    interpolation: { escapeValue: false },
    fallbackLng: 'es', // Si algo falla, cargamos español por las dudas
    resources: {
      es: {
        global: global_es
      },
      en: {
        global: global_en
      }
    }
  });

export default i18n;