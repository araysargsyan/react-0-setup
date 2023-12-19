import { type ComponentType, memo } from 'react';
import  { type PathRouteProps } from 'react-router-dom';
import { lazyImport } from 'app/router';
import { type TAddAsyncReducerParameters, } from 'config/store';
import { type TAddAsyncReducerOp } from 'config/store/types';


const enum Routes {
    MAIN = '/',
    MAIN2 = '/main2',
    TEST = '/test',
    // LOGIN = '/login',
    ABOUT = '/about',
    PROFILE = '/profile',
    ARTICLES = '/articles',
    ARTICLE_DETAILS = '/articles/:id',
    NOT_FOUND = '*',
}
type TRoutes = ValueOf<typeof Routes>;

interface IRouterConfig extends PathRouteProps {
    Element: ComponentType;
    asyncReducers?: TAddAsyncReducerOp;
    state?: TAddAsyncReducerParameters[1];
}
type TRoutesConfig = {
    [KEY in TRoutes]: IRouterConfig
};
const routesConfig: TRoutesConfig = {
    [Routes.MAIN]: { Element: memo(lazyImport(() => import('pages/Main'))) },
    [Routes.MAIN2]: { Element: memo(lazyImport(() => import('pages/Main'))) },
    [Routes.TEST]: { Element: memo(lazyImport(() => import('pages/Main'))) },
    [Routes.ABOUT]: { Element: memo(lazyImport(() => import('pages/About'))) },
    [Routes.PROFILE]: { Element: memo(lazyImport(() => import('pages/Profile'))), },
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
    [Routes.ARTICLES]: { Element: memo(lazyImport(() => import('pages/Articles'))), },
    [Routes.ARTICLE_DETAILS]: { Element: memo(lazyImport(() => import('pages/Articles/[id]'))), },
    [Routes.NOT_FOUND]: { Element: memo(lazyImport(() => import('pages/NotFound'))) },
};

export {
    Routes,
    routesConfig,
    type TRoutes
};
