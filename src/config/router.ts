import { type ComponentType, memo } from 'react';
import  { type PathRouteProps } from 'react-router-dom';
import { lazyImport } from 'app/router';
import {
    type IStateSchema, type TAddAsyncReducerParameters, type TAsyncReducerOptions
} from 'config/store';
import { type TAddAsyncReducerOp } from 'config/store/types';
import { type DeepPartial } from '@reduxjs/toolkit';


export const enum ERoutes {
    MAIN = '/',
    MAIN2 = '/as',
    LOGIN = '/login',
    ABOUT = '/about',
    PROFILE = '/profile',
    NOT_FOUND = '*',
}

// export const CRoutes = {
//     MAIN: '/',
//     LOGIN: '/login',
//     ABOUT: '/about',
//     PROFILE: '/profile',
//     NOT_FOUND: '*',
// };

export interface IRouterConfig {
    Element: ComponentType;
    path: ERoutes;
    asyncReducers?: TAddAsyncReducerOp;
    state?: TAddAsyncReducerParameters[1];
}
export const routesConfig: Array<PathRouteProps & IRouterConfig> = [
    {
        path: ERoutes.MAIN,
        Element: memo(lazyImport(() => import('pages/Main')))
    },
    {
        path: ERoutes.MAIN2,
        Element: memo(lazyImport(() => import('pages/Main')))
    },
    {
        path: ERoutes.ABOUT,
        Element: memo(lazyImport(() => import('pages/About')))
    },
    {
        path: ERoutes.PROFILE,
        Element: memo(lazyImport(() => import('pages/Profile'))),
    },
    //     // asyncReducers: async () => {
    //     //     const profileReducer = (await import('store/Profile')).default;
    //     //
    //     //     return [ {
    //     //         key: profileReducer.name,
    //     //         reducer: profileReducer.reducer,
    //     //     } ];
    //     // },
    // },
    //! must be last
    {
        path: ERoutes.NOT_FOUND,
        Element: memo(lazyImport(() => import('pages/NotFound')))
    },
];


