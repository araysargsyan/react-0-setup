import  { type ComponentType } from 'react';
import  { type PathRouteProps } from 'react-router-dom';
import { lazyImport } from 'app/router';


export enum ERoutes {
    MAIN = '/',
    ABOUT = '/about',
    NOT_FOUND = '*',
}

export const routesConfig: Array<PathRouteProps & { Element: ComponentType; path: ERoutes }> = [
    {
        path: ERoutes.MAIN,
        Element: lazyImport(() => import('pages/Main'))
    },
    {
        path: ERoutes.ABOUT,
        Element: lazyImport(() => import('pages/About'))
    },
    {
        path: ERoutes.NOT_FOUND,
        Element: lazyImport(() => import('pages/NotFound'))
    },
];

 
