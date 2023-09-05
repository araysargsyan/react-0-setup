import {
    type ComponentType,
    type FC, memo,
    Suspense,
    useCallback
} from 'react';
import { Route, Routes } from 'react-router-dom';
import { type IRouterConfig, routesConfig } from 'config/router';
import PageLoader from 'components/PageLoader';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { AsyncReducer, type TAsyncReducerOptions } from 'config/store';


interface IElementWithWrapper {
    asyncReducers?: TAsyncReducerOptions;
    Element: ComponentType;
}

const ElementWithWrapper = memo<IElementWithWrapper>(function ElementWithWrapper(
    { asyncReducers, Element }
) {
    if (!asyncReducers) {
        return <Element />;
    }

    return (
        <AsyncReducer
            options={ asyncReducers }
            removeAfterUnmount
        >
            <Element />
        </AsyncReducer>
    );
});

const AppRouter: FC = () => {
    const renderWithWrapper = useCallback(({
        asyncReducers, Element, path
    }: IRouterConfig) => {
        return (
            <Route
                key={ path }
                path={ path }
                element={ (
                    <ElementWithWrapper
                        asyncReducers={ asyncReducers }
                        Element={ Element }
                    />
                ) }
            />
        );
    }, []);

    useRenderWatcher(AppRouter.name);
    return (
        <div className="page-wrapper">
            <Suspense fallback={ <PageLoader /> }>
                <Routes>
                    { routesConfig.map(renderWithWrapper) }
                </Routes>
            </Suspense>
        </div>
    );
};

export default AppRouter;
