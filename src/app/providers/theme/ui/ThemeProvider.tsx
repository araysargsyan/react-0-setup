import React, {
    type FC, type PropsWithChildren, useMemo, useState
} from 'react';
import { LOCAL_STORAGE_THEME_KEY } from 'shared/const';

import { ETheme, ThemeContext } from '../lib/ThemeContext';


const defaultTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as ETheme || ETheme.LIGHT;

interface EThemeProviderProps {
    initialTheme?: ETheme;
}
const ThemeProvider: FC<PropsWithChildren<EThemeProviderProps>> = ({ children, initialTheme }) => {
    const [ theme, setTheme ] = useState<ETheme>(initialTheme || defaultTheme);

    const defaultProps = useMemo(() => ({
        theme,
        setTheme,
    }), [ theme ]);

    return (
        <ThemeContext.Provider value={ defaultProps }>
            { children }
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
