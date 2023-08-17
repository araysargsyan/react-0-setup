import { type ReactNode } from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';


export default function renderWithTranslation(component: ReactNode) {
    const i18nForTests = i18n.createInstance();
    i18nForTests
        .use(initReactI18next)
        .init({
            lng: 'en',
            fallbackLng: 'en',
            debug: false,

            interpolation: {
                escapeValue: false,
            },
            resources: { en: { translations: {} } },
        });

    return render(
        <I18nextProvider i18n={ i18nForTests }>
            { component }
        </I18nextProvider>,
    );
}
