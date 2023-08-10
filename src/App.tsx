import React from 'react';
import './styles/index.scss';
import AppRouter from "./pages/AppRouter";
import Counter from "./components/Counter";
import {useTheme} from "./theme/useTheme";
import classNames from "./helpers/classNames/classNames";

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
