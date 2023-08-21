import { useEffect } from 'react';
import _c from 'shared/helpers/classNames';
import AppRouter from 'app/router';
import Sidebar from 'components/SideBar';
import Navbar from 'components/Navbar';
import { useDispatch } from 'react-redux';
import { userActions } from 'store/User';


function App() {
    const dispatch = useDispatch();

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
