import { type FC } from 'react';
import classNames from 'helpers/classNames';

import cls from './Navbar.module.scss';


interface INavbarProps {
    className?: string;
}
const Navbar: FC<INavbarProps> = ({ className }) => {
    return (
        <div className={ classNames(cls.navbar, [ className ]) }>
            <div className={ classNames(cls.links) }>
                /
            </div>
        </div>
    );
};

export default Navbar;
