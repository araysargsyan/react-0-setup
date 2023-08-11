import './styles/index.scss';
import AppRouter from "./AppRouter";
import {useTheme} from "./providers/theme";
import Counter from "components/Counter";
import classNames from "helpers/classNames";

function App() {
    const {theme, toggleTheme} = useTheme()

    return (
        <div className={classNames('app', [theme])}>
            <div onClick={toggleTheme}>Toggle theme</div>
            <Counter />
            <AppRouter/>
        </div>
    );
}

export default App;
