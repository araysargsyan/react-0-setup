import { type FC, useCallback, } from 'react';
import { Route, Routes as Router } from 'react-router-dom';
import {
    routesConfig,
    type TRoutes
} from 'config/router';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { AsyncReducer } from 'config/store';
import { ProtectedElement } from 'store/app';
import PageLoader from 'components/PageLoader';


const AppRouter: FC = () => {
    const enrichmentRender = useCallback((path: TRoutes) => {
        const {
            Element, asyncReducers, state
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
                        >
                            { asyncReducers ? (
                                <AsyncReducer
                                    options={ asyncReducers as never }
                                    state={ state }
                                    removeAfterUnmount
                                >
                                    <Element />
                                </AsyncReducer>
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
