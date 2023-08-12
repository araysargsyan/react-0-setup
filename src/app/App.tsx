import './styles/index.scss';
import {useTheme} from "./providers/theme";
import classNames from "helpers/classNames";
import AppRouter from "app/router";
import Navbar from "components/Navbar"
import Sidebar from "components/SideBar";
import {Suspense} from "react";

function App() {
    const {theme} = useTheme()

    return (
        <div className={classNames('app', [theme])}>
            <Suspense fallback={'App loading'}>
                <Navbar/>
                <div className='content-page'>
                    <Sidebar/>
                    <AppRouter/>
                </div>
            </Suspense>
        </div>
    );
}

export default App;
