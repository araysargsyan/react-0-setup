import { useContext } from 'react';
import { LOCAL_STORAGE_THEME_KEY } from 'shared/const';

import { ETheme, ThemeContext } from './ThemeContext';


interface IUseThemeResult {
    toggleTheme: () => void;
    theme: ETheme;
}

export default function useTheme(): IUseThemeResult {
    const { theme, setTheme } = useContext(ThemeContext);

    if (!theme) {
        throw new Error('can\'t use useTheme outside of StoreProvider');
    }

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
