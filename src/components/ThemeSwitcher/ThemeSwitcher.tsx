import {FC} from 'react';
import cls from './ThemeSwitcher.module.scss';
import classNames from "helpers/classNames";
import {ETheme, useTheme} from "app/providers/theme";
import LightIcon from 'shared/assets/icons/theme-light.svg';
import DarkIcon from 'shared/assets/icons/theme-dark.svg';
import AppButton from "shared/ui/AppButton";

interface IThemeSwitcherProps {
    className?: string;
}
const ThemeSwitcher: FC<IThemeSwitcherProps> = ({className}) => {
    const {theme, toggleTheme} = useTheme()

    return (
        <AppButton
            className={classNames(cls["theme-switcher"], [className])}
            onClick={toggleTheme}
        >
            {theme === ETheme.LIGHT ? <LightIcon /> : <DarkIcon />}
        </AppButton>
    );
}

export default ThemeSwitcher;
