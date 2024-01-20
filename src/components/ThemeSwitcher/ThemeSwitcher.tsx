import { type FC, memo } from 'react';
import _c from 'shared/helpers/classNames';
import LightIcon from 'shared/assets/icons/theme-light.svg';
import DarkIcon from 'shared/assets/icons/theme-dark.svg';
import AppButton from 'shared/ui/AppButton';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { ETheme, UIActionCreators } from 'store/UI';
import { useActions, useAppSelector } from 'shared/hooks/redux';

import cls from './ThemeSwitcher.module.scss';


interface IThemeSwitcherProps {
    className?: string;
}
const ThemeSwitcher: FC<IThemeSwitcherProps> = ({ className }) => {
    const { setTheme } = useActions(UIActionCreators, [ 'setTheme' ]);
    const theme = useAppSelector(({ UI }) => UI.theme);

    useRenderWatcher(ThemeSwitcher.name, theme);
    return (
        <AppButton
            className={ _c(cls['theme-switcher'], [ className ]) }
            onClick={ () => setTheme(theme === ETheme.LIGHT ? ETheme.DARK : ETheme.LIGHT) }
        >
            { theme === ETheme.LIGHT ? <LightIcon /> : <DarkIcon /> }
        </AppButton>
    );
};

export default memo(ThemeSwitcher);
