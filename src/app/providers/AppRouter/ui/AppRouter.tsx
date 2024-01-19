import { type FC, useCallback, } from 'react';
import { Route, Routes as Router } from 'react-router-dom';
import {
    routesConfig,
    type TRoutes
} from 'config/router';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { ProtectedElement } from 'store/app';
import PageLoader from 'components/PageLoader';
import { AsyncReducerProvider } from 'config/store';


const AppRouter: FC = () => {
    const enrichmentRender = useCallback((path: TRoutes) => {
        const {
            Element, asyncReducers, isLazy
        } = routesConfig[path];

        return (
            <Route
                key={ path }
                path={ path }
                element={ (
                    <>
                        <ProtectedElement
                            pathname={ path }
                            PageLoader={ PageLoader }
                            lazy={ isLazy }
                        >
                            { asyncReducers ? (
                                <AsyncReducerProvider
                                    options={ asyncReducers }
                                    removeAfterUnmount
                                >
                                    <Element />
                                </AsyncReducerProvider>
                            ) : <Element /> }
                        </ProtectedElement>
                    </>
                ) }
            />
        );
    }, []);

    useRenderWatcher(AppRouter.name);
    return (
        <Router>
            { (Object.keys(routesConfig) as TRoutes[]).map((path) => enrichmentRender(path)) }
        </Router>
    );
};

export default AppRouter;
