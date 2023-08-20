import { type FC, useState } from 'react';
import _c from 'shared/helpers/classNames';
import ThemeSwitcher from 'components/ThemeSwitcher';
import LangSwitcher from 'components/LangSwitcher';
import AppButton, { EAppButtonSize, EAppButtonTheme } from 'shared/ui/AppButton';
import AboutIcon from 'shared/assets/icons/about-20-20.svg';
import MainIcon from 'shared/assets/icons/main-20-20.svg';
import { useTranslation } from 'react-i18next';
import AppLink, { EAppLinkTheme } from 'shared/ui/AppLink';
import { ERoutes } from 'app/config/router-config';

import cls from './Sidebar.module.scss';


interface ISidebarProps {
    className?: string;
}
const Sidebar: FC<ISidebarProps> = ({ className }) => {
    const [ collapsed, setCollapsed ] = useState(false);
    const { t } = useTranslation();

    const onToggle = () => setCollapsed(prev => !prev);

    return (
        <div
            data-testid="sidebar"
            className={ _c(cls['sidebar'], [ className ], { [cls.collapsed]: collapsed }) }
        >
            <AppButton
                data-testid="sidebar-toggle"
                onClick={ onToggle }
                className={ cls['collapsed-btn'] }
                theme={ EAppButtonTheme.BACKGROUND_INVERTED }
                size={ EAppButtonSize.L }
                square
            >
                { collapsed ? '>' : '<' }
            </AppButton>
            <div className={ cls.items }>
                <AppLink
                    theme={ EAppLinkTheme.SECONDARY }
                    to={ ERoutes.MAIN }
                    className={ cls.item }
                >
                    <MainIcon className={ cls.icon } />
                    <span className={ cls.link }>
                        { t('Main') }
                    </span>
                </AppLink>
                <AppLink
                    theme={ EAppLinkTheme.SECONDARY }
                    to={ ERoutes.ABOUT }
                    className={ cls.item }
                >
                    <AboutIcon className={ cls.icon } />
                    <span className={ cls.link }>
                        { t('About us') }
                    </span>
                </AppLink>
            </div>
            <div className={ cls.switchers }>
                <ThemeSwitcher />
                <LangSwitcher
                    short={ collapsed }
                    className={ cls.lang }
                />
            </div>
        </div>
    );
};

export default Sidebar;
