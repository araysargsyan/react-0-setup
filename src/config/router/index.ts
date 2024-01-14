import { memo } from 'react';
import { lazyImport } from 'app/providers/AppRouter';

import createRoutesConfig from './lib/createRoutesConfig';


const Routes = {
    MAIN: '/',
    TEST: '/test',
    // LOGIN: '/login',
    ABOUT: '/about',
    PROFILE: '/profile',
    ARTICLES: '/articles',
    ARTICLE_DETAILS: '/articles/:id',
    NOT_FOUND: '*'
} as const;
type TRoutes = ValueOf<typeof Routes>;

const routesConfig = createRoutesConfig<TRoutes>({
    [Routes.MAIN]: { Element: memo(lazyImport(() => import('pages/Main'))) },
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
});

export {
    Routes,
    routesConfig,
    type TRoutes
};


