import { type FC, type SVGProps } from 'react';
import AboutIcon from 'shared/assets/icons/about-20-20.svg';
import MainIcon from 'shared/assets/icons/main-20-20.svg';
import ProfileIcon from 'shared/assets/icons/profile-20-20.svg';
import ArticleIcon from 'shared/assets/icons/article-20-20.svg';
import { Routes } from 'config/router';


export interface ISidebarItem {
    path: string;
    text: string;
    Icon?: FC<SVGProps<SVGSVGElement>>;
}


export const sidebarItemsList: ISidebarItem[] = [
    {
        path: Routes.MAIN,
        Icon: MainIcon,
        text: 'Main',
    },
    {
        path: Routes.ABOUT,
        Icon: AboutIcon,
        text: 'About us',
    },
    {
        path: Routes.PROFILE,
        Icon: ProfileIcon,
        text: 'Профиль',
    },
    {
        path: Routes.ARTICLES,
        Icon: ArticleIcon,
        text: 'Статьи',
    },
    {
        path: '/not-found',
        text: 'Not Found',
    },
    {
        path: Routes.TEST,
        text: 'TEST',
    },
];
