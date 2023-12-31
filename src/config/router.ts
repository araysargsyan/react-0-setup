import { type ComponentType, memo } from 'react';
import  { type PathRouteProps } from 'react-router-dom';
import { lazyImport } from 'app/router';
import { type TAsyncReducerOptions } from 'config/store/types';


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
    asyncReducers?: TAsyncReducerOptions;
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
    [Routes.ARTICLES]: {
        Element: memo(lazyImport(() => import('pages/Articles'))),
        // asyncReducers: async () => {
        //     const articlesReducer = (await import('store/Articles')).default;
        //
        //     return {
        //         reducerOptions: [ {
        //             key: articlesReducer.name,
        //             reducer: articlesReducer.reducer,
        //         } ],
        //         state: {}
        //     };
        // },
    },
    [Routes.ARTICLE_DETAILS]: { Element: memo(lazyImport(() => import('pages/Articles/[id]'))), },
    //! must be last
    [Routes.NOT_FOUND]: { Element: memo(lazyImport(() => import('pages/NotFound'))) },
};

export {
    Routes,
    routesConfig,
    type TRoutes
};
