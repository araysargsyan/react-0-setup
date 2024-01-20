import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from 'app/providers/ErrorBoundary';
import StoreProvider from 'app/providers/StoreProvider';
import TranslationProvider from 'app/providers/TranslationProvider';
import App from 'app/App';
import 'app/styles/index.scss';
// import 'config/i18n';


const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <TranslationProvider>
            <StoreProvider>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </StoreProvider>
        </TranslationProvider>
    </BrowserRouter>
);
