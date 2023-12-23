import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEn from '@locales/en/translation.json';
import translationRu from '@locales/ru/translation.json';


i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false, //__IS_DEV__,
        fallbackLng: 'en',
        resources: {
            en: { translation: translationEn },
            ru: { translation: translationRu }
        },
        partialBundledLanguages: true,

        interpolation: { escapeValue: false }, // not needed for react as it escapes by default

        backend: { loadPath: '/locales/{{lng}}/{{ns}}.json', }
    });


export default i18n;
