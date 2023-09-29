import { I18nextProvider } from 'react-i18next';
import i18n from 'config/i18n';
import {
    type FC,
    type PropsWithChildren, Suspense,
    useEffect
} from 'react';


const TranslationProvider: FC<PropsWithChildren> = ({ children }) => {
    useEffect(() => {
        console.log('TranslationProvider');
    });

    return (
        <I18nextProvider i18n={ i18n }>
            { /*<Suspense>*/ }
            { children }
            { /*</Suspense>*/ }
        </I18nextProvider>
    );
};

export default TranslationProvider;
