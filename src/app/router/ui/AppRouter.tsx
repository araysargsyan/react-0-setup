import {
    type ComponentType,
    type FC, LazyExoticComponent,
    memo, type PropsWithChildren, ReactComponentElement, type ReactElement,
    Suspense,
    useCallback, useEffect
} from 'react';
import {
    Route,
    Routes,
} from 'react-router-dom';
import { type IRouterConfig, routesConfig } from 'config/router';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { AsyncReducer, type TAsyncReducerOptions } from 'config/store';
import { ProtectedElement } from 'store/app';


const AppRouter: FC = () => {
    const renderWithWrapper = useCallback(({
        asyncReducers, state, Element, path
    }: IRouterConfig) => {
        return (
            <Route
                key={ path }
                path={ path }
                element={ (
                    <>
                        <ProtectedElement pathname={ path }>
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
        <div className="page-wrapper">
            <>
                <Routes>
                    { routesConfig.map(renderWithWrapper) }
                </Routes>
            </>
        </div>
    );
};

export default AppRouter;
