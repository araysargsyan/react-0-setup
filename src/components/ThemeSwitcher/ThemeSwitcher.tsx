import { type FC, memo } from 'react';
import _c from 'shared/helpers/classNames';
import { ETheme, useTheme } from 'app/providers/theme';
import LightIcon from 'shared/assets/icons/theme-light.svg';
import DarkIcon from 'shared/assets/icons/theme-dark.svg';
import AppButton from 'shared/ui/AppButton';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

import cls from './ThemeSwitcher.module.scss';

 
interface IThemeSwitcherProps {
    className?: string;
}
const ThemeSwitcher: FC<IThemeSwitcherProps> = ({ className }) => {
    const { theme, toggleTheme } = useTheme();

    useRenderWatcher(ThemeSwitcher.name, theme);
    return (
        <AppButton
            className={ _c(cls['theme-switcher'], [ className ]) }
            onClick={ toggleTheme }
        >
            { theme === ETheme.LIGHT ? <LightIcon /> : <DarkIcon /> }
        </AppButton>
    );
};

export default memo(ThemeSwitcher);
