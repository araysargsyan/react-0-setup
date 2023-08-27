import type React from 'react';
import AboutIcon from 'shared/assets/icons/about-20-20.svg';
import MainIcon from 'shared/assets/icons/main-20-20.svg';
import ProfileIcon from 'shared/assets/icons/profile-20-20.svg';
import { ERoutes } from 'config/router';


export interface ISidebarItem {
    path: string;
    text: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const sidebarItemsList: ISidebarItem[] = [
    {
        path: ERoutes.MAIN,
        Icon: MainIcon,
        text: 'Main',
    },
    {
        path: ERoutes.ABOUT,
        Icon: AboutIcon,
        text: 'About us',
    },
    {
        path: ERoutes.PROFILE,
        Icon: ProfileIcon,
        text: 'Профиль',
    },
];
