import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'app/providers/theme';
import App from 'app/App';
import 'app/config/i18n';


const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </BrowserRouter>
);
