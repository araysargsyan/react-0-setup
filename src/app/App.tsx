import { Suspense } from 'react';
import _c from 'shared/helpers/classNames';
import AppRouter from 'app/router';
import Sidebar from 'components/SideBar';
import Navbar from 'components/Navbar';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

import { useTheme } from './providers/theme';


function App() {
    const { theme } = useTheme();

    useRenderWatcher(App.name, JSON.stringify({ theme }));
    return (
        <div className={ _c('app', [ theme ]) }>
            <Suspense fallback={ <h1>APP LOADING</h1> }>
                <Navbar />
                <div className="content-page">
                    <Sidebar />
                    <AppRouter />
                </div>
            </Suspense>
        </div>
    );
}

export default App;
