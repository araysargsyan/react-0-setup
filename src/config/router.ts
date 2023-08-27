import { type ComponentType, memo } from 'react';
import  { type PathRouteProps } from 'react-router-dom';
import { lazyImport } from 'app/router';


export enum ERoutes {
    MAIN = '/',
    ABOUT = '/about',
    PROFILE = '/profile',
    NOT_FOUND = '*',
}

export const routesConfig: Array<PathRouteProps & { Element: ComponentType; path: ERoutes }> = [
    {
        path: ERoutes.MAIN,
        Element: memo(lazyImport(() => import('pages/Main')))
    },
    {
        path: ERoutes.ABOUT,
        Element: memo(lazyImport(() => import('pages/About')))
    },
    {
        path: ERoutes.PROFILE,
        Element: memo(lazyImport(() => import('pages/Profile')))
    },
    //! must be last
    {
        path: ERoutes.NOT_FOUND,
        Element: memo(lazyImport(() => import('pages/NotFound')))
    },
];

 
