import { createContext } from 'react';


export enum ETheme {
    LIGHT = 'app-light-theme',
    DARK = 'app-dark-theme'
}

export interface ThemeContextProps {
    theme?: ETheme;
    setTheme?: (theme: ETheme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({});

export const LOCAL_STORAGE_THEME_KEY = 'theme';
