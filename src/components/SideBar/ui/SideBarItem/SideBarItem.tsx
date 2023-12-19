import { useTranslation } from 'react-i18next';
import { type FC, memo } from 'react';
import AppLink, { EAppLinkTheme } from 'shared/ui/AppLink';
import _c from 'shared/helpers/classNames';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

import cls from './SideBarItem.module.scss';
import { type ISidebarItem } from '../../model/items';


interface ISidebarItemProps {
    item: ISidebarItem;
    collapsed: boolean;
}

const SidebarItem: FC<ISidebarItemProps> = ({ item, collapsed }) => {
    const { t } = useTranslation();

    useRenderWatcher(SidebarItem.name, JSON.stringify(item));
    return (
        <AppLink
            theme={ EAppLinkTheme.SECONDARY }
            to={ item.path }
            className={ _c(cls.item, [], { [cls.collapsed]: collapsed }) }
        >
            { item.Icon && <item.Icon className={ cls.icon } /> }
            <span className={ cls.link }>
                { t(item.text) }
            </span>
        </AppLink>
    );
};

export default memo(SidebarItem);
