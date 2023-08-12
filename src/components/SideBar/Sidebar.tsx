import {FC, useState} from 'react';
import cls from './Sidebar.module.scss';
import classNames from "helpers/classNames";
import ThemeSwitcher from "components/ThemeSwitcher";
import LangSwitcher from "components/LangSwitcher";

interface ISidebarProps {
    className?: string;
}
const Sidebar: FC<ISidebarProps> = ({className}) => {
    const [collapsed, setCollapsed] = useState(false)

    const onToggle = () => setCollapsed(prev => !prev)

    return (
        <div className={classNames(cls["sidebar"], [className], {[cls.collapsed]: collapsed})}>
            <button onClick={onToggle}>toggle</button>
            <div className={cls.switchers}>
                <ThemeSwitcher />
                <LangSwitcher className={cls.lang}/>
            </div>
        </div>
    );
}

export default Sidebar;
