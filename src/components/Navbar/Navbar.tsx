import { type FC } from 'react';
import classNames from 'helpers/classNames';
import AppLink, { EAppLinkTheme } from 'shared/ui/AppLink';

import cls from './Navbar.module.scss';


interface INavbarProps {
    className?: string;
}
const Navbar: FC<INavbarProps> = ({ className }) => {
    return (
        <div className={ classNames(cls.navbar, [ className ]) }>
            <div className={ classNames(cls.links) }>
                <AppLink
                    to="/"
                    theme={ EAppLinkTheme.SECONDARY }
                >
                    Home
                </AppLink>
                <AppLink
                    to="/about"
                    theme={ EAppLinkTheme.SECONDARY }
                >
                    About
                </AppLink>
            </div>
        </div>
    );
};

export default Navbar;
