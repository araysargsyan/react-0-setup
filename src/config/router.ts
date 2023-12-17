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
    MAIN2 = '/main2',
    TEST = '/test',
    // LOGIN = '/login',
    ABOUT = '/about',
    ABOUT2 = '/about2',
    PROFILE = '/profile',
    NOT_FOUND = '*',
}

interface IRouterConfig extends PathRouteProps {
    Element: ComponentType;
    // path: ERoutes;
    asyncReducers?: TAddAsyncReducerOp;
    state?: TAddAsyncReducerParameters[1];
}
type TRoutesConfig = {
    [KEY in ERoutes]: IRouterConfig
};
export const routesConfig: TRoutesConfig = {
    [ERoutes.MAIN]: {
        // path: ERoutes.MAIN,
        Element: memo(lazyImport(() => import('pages/Main')))
    },
    [ERoutes.MAIN2]: {
        // path: ERoutes.MAIN2,
        Element: memo(lazyImport(() => import('pages/Main')))
    },
    [ERoutes.TEST]: {
        // path: ERoutes.TEST,
        Element: memo(lazyImport(() => import('pages/Main')))
    },
    [ERoutes.ABOUT]: {
        // path: ERoutes.ABOUT,
        Element: memo(lazyImport(() => import('pages/About')))
    },
    [ERoutes.ABOUT2]: {
        // path: ERoutes.ABOUT2,
        Element: memo(lazyImport(() => import('pages/About')))
    },
    [ERoutes.PROFILE]: {
        // path: ERoutes.PROFILE,
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
    [ERoutes.NOT_FOUND]: {
        // path: ERoutes.NOT_FOUND,
        Element: memo(lazyImport(() => import('pages/NotFound')))
    },
};


