import _c from 'shared/helpers/classNames';
import AppRouter from 'app/router';
import Sidebar from 'components/SideBar';
import Navbar from 'components/Navbar';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { useEffect, useLayoutEffect } from 'react';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { useNavigate } from 'react-router-dom';
import Flex from 'shared/ui/Stack';

import { useTheme } from './providers/theme';


function App() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    // useLayoutEffect(() => {
    //     setTimeout(() => {
    //         navigate('/');
            // setTimeout(() => {
            //     navigate('/');
            //     setTimeout(() => {
            //         navigate('/about');
            //         setTimeout(() => {
            //             navigate('/profile');
            //         }, 100);
            //     }, 0);
            // }, 600);
    //     }, 2200);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // useEffect(() => {
    //     setTimeout(() => {
    //         if (localStorage.getItem(USER_LOCALSTORAGE_KEY)) {
    //             localStorage.removeItem(USER_LOCALSTORAGE_KEY);
    //         }
    //     }, 50000);
    // }, []);

    useRenderWatcher(App.name, JSON.stringify({ theme }));
    return (

        <div className={ _c('app', [ theme ]) }>
            <Navbar />
            <Flex className={ 'content-page' }>
                <Sidebar />
                <AppRouter />
            </Flex>
        </div>
    );
}

export default App;
