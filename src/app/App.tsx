import './styles/index.scss';
import {useTheme} from "./providers/theme";
import classNames from "helpers/classNames";
import AppRouter from "app/router";
import Navbar from "components/Navbar"

function App() {
    const {theme} = useTheme()

    return (
        <div className={classNames('app', [theme])}>
            <Navbar />
            <AppRouter/>
        </div>
    );
}

export default App;
