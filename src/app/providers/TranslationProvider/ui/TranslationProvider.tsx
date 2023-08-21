import { I18nextProvider } from 'react-i18next';
import i18n from 'config/i18n';
import  {
    type FC, type PropsWithChildren, Suspense 
} from 'react';


const TranslationProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <I18nextProvider i18n={ i18n }>
            <Suspense fallback={ <h1>{ 'Loading translation' }</h1> }>
                { children }
            </Suspense>
        </I18nextProvider>
    );
};

export default TranslationProvider;
