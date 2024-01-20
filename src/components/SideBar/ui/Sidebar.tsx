import {
    memo, useMemo, type FC
} from 'react';
import LangSwitcher from 'components/LangSwitcher';
import ThemeSwitcher from 'components/ThemeSwitcher';
import AppButton, { EAppButtonSize, EAppButtonTheme } from 'shared/ui/AppButton';
import _c from 'shared/helpers/classNames';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { useActions, useAppSelector } from 'shared/hooks/redux';
import { UIActionCreators } from 'store/UI';

import { sidebarItemsList } from '../model/items';
import cls from './Sidebar.module.scss';
import SidebarItem from './SideBarItem';


interface ISidebarProps {
    className?: string;
}

const Sidebar: FC<ISidebarProps> = ({ className }) => {
    const collapsed = useAppSelector(({ UI }) => UI.collapsed);
    const { toggleCollapsed } = useActions(UIActionCreators, [ 'toggleCollapsed' ]);

    const itemsList = useMemo(() => sidebarItemsList.map((item) => (
        <SidebarItem
            item={ item }
            collapsed={ collapsed }
            key={ item.path }
        />
    )), [ collapsed ]);

    useRenderWatcher(Sidebar.name, JSON.stringify({ collapsed }));

    return (
        <div
            data-testid="sidebar"
            className={ _c(cls.sidebar, [ className ], { [cls.collapsed]: collapsed }) }
        >
            <AppButton
                data-testid="sidebar-toggle"
                onClick={ () => toggleCollapsed() }
                className={ cls['collapsed-btn'] }
                theme={ EAppButtonTheme.BACKGROUND_INVERTED }
                size={ EAppButtonSize.L }
                square
            >
                { collapsed ? '>' : '<' }
            </AppButton>
            <div className={ cls.items }>
                { itemsList }
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

export default memo(Sidebar);
