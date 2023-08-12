import {FC} from 'react';
import cls from './Navbar.module.scss';
import classNames from "helpers/classNames";
import AppLink, {EAppLinkTheme} from "shared/ui/AppLink";

interface INavbarProps {
    className?: string;
}
const Navbar: FC<INavbarProps> = ({className}) => {
    return (
        <div className={classNames(cls.navbar, [className])}>
            <div className={classNames(cls.links)}>
                <AppLink
                    to='/'
                    theme={EAppLinkTheme.SECONDARY}
                >
                    Home
                </AppLink>
                <AppLink
                    to='/about'
                    theme={EAppLinkTheme.SECONDARY}
                >
                    About
                </AppLink>
            </div>
        </div>
    );
}

export default Navbar;
