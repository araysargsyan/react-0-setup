import { useContext, useEffect } from 'react';

import { ETheme, LOCAL_STORAGE_THEME_KEY, ThemeContext } from './ThemeContext';

 
interface UseThemeResult {
    toggleTheme: () => void;
    theme: ETheme;
}

export function useTheme(): UseThemeResult {
    const { theme, setTheme } = useContext(ThemeContext);

    useEffect(() => {
        document.body.className = theme;
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === ETheme.DARK ? ETheme.LIGHT : ETheme.DARK;
        setTheme(newTheme);
        document.body.className = newTheme;
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
    };

    return {
        theme,
        toggleTheme,
    };
}
