import { Suspense, useEffect } from 'react';
import _c from 'shared/helpers/classNames';
import AppRouter from 'app/router';
import Sidebar from 'components/SideBar';
import Navbar from 'components/Navbar';
import { userActions } from 'store/User';
import { useActions } from 'shared/hooks/redux';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

import { useTheme } from './providers/theme';


function App() {
    const { initAuthData } = useActions(userActions, [ 'initAuthData' ]);
    const { theme } = useTheme();

    useEffect(() => {
        initAuthData();
    }, [ initAuthData ]);

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
