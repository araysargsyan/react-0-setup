import { useContext, useEffect } from 'react';

import {
    ETheme, LOCAL_STORAGE_THEME_KEY, ThemeContext 
} from './ThemeContext';


interface IUseThemeResult {
    toggleTheme: () => void;
    theme: ETheme;
}

export default function useTheme(): IUseThemeResult {
    const { theme, setTheme } = useContext(ThemeContext);
    console.log(666, theme);
    if (!theme) {
        throw new Error('can\'t use useTheme outside of StoreProvider');
    }

    useEffect(() => {
        document.body.className = theme;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === ETheme.DARK ? ETheme.LIGHT : ETheme.DARK;
        setTheme?.(newTheme);
        document.body.className = newTheme;
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
    };

    return {
        theme,
        toggleTheme,
    };
}
