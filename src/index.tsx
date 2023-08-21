import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from 'app/providers/theme';
import ErrorBoundary from 'app/providers/ErrorBoundary';
import StoreProvider from 'app/providers/StoreProvider';
import TranslationProvider from 'app/providers/TranslationProvider';
import App from 'app/App';
import 'app/styles/index.scss';


const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <TranslationProvider>
        <StoreProvider>
            <BrowserRouter>
                <ErrorBoundary>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </ErrorBoundary>
            </BrowserRouter>
        </StoreProvider>
    </TranslationProvider>
);
