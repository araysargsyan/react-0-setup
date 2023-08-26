import { useEffect } from 'react';
import _c from 'shared/helpers/classNames';
import AppRouter from 'app/router';
import Sidebar from 'components/SideBar';
import Navbar from 'components/Navbar';
import { userActions } from 'store/User';
import { useAppDispatch } from 'shared/hooks/redux';


function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(userActions.initAuthData());
    }, [ dispatch ]);
    
    return (
        <div className={ _c('app') }>
            <Navbar />
            <div className="content-page">
                <Sidebar />
                <AppRouter />
            </div>
        </div>
    );
}

export default App;
