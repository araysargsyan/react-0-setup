import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from 'app/providers/theme';
import ErrorBoundary from 'app/providers/ErrorBoundary';
import App from 'app/App';
import 'app/config/i18n';


const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <ErrorBoundary>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </ErrorBoundary>
    </BrowserRouter>
);
