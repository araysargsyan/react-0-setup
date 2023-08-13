import { type FC } from 'react';
import classNames from 'helpers/classNames';
import AppLink, { EAppLinkTheme } from 'shared/ui/AppLink';
import { useTranslation } from 'react-i18next';

import cls from './Navbar.module.scss';


interface INavbarProps {
    className?: string;
}
const Navbar: FC<INavbarProps> = ({ className }) => {
    const { t } = useTranslation();

    return (
        <div className={ classNames(cls.navbar, [ className ]) }>
            <div className={ classNames(cls.links) }>
                <AppLink
                    to="/"
                    theme={ EAppLinkTheme.SECONDARY }
                >
                    { t('Main') }
                </AppLink>
                <AppLink
                    to="/about"
                    theme={ EAppLinkTheme.SECONDARY }
                >
                    { t('About us') }
                </AppLink>
            </div>
        </div>
    );
};

export default Navbar;
