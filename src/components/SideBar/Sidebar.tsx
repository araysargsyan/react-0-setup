import { type FC, useState } from 'react';
import classNames from 'helpers/classNames';
import ThemeSwitcher from 'components/ThemeSwitcher';
import LangSwitcher from 'components/LangSwitcher';

import cls from './Sidebar.module.scss';

 
interface ISidebarProps {
    className?: string;
}
const Sidebar: FC<ISidebarProps> = ({ className }) => {
    const [ collapsed, setCollapsed ] = useState(false);

    const onToggle = () => setCollapsed(prev => !prev);

    return (
        <div className={ classNames(cls['sidebar'], [ className ], { [cls.collapsed]: collapsed }) }>
            <button onClick={ onToggle }>toggle</button>
            <div className={ cls.switchers }>
                <ThemeSwitcher />
                <LangSwitcher className={ cls.lang } />
            </div>
        </div>
    );
};

export default Sidebar;
