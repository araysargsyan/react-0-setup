import { Suspense } from 'react';
import classNames from 'helpers/classNames';
import AppRouter from 'app/router';
import Sidebar from 'components/SideBar';
import Navbar from 'components/Navbar';

import { useTheme } from './providers/theme';
import './styles/index.scss';


function App() {
    const { theme } = useTheme();

    return (
        <div className={ classNames('app', [ theme ]) }>
            <Suspense fallback={ 'App loading' }>
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
