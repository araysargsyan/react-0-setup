import {
    type ComponentType,
    type FC,
    memo,
    Suspense,
    useCallback
} from 'react';
import {
    Route,
    Routes,
} from 'react-router-dom';
import { type IRouterConfig, routesConfig } from 'config/router';
import PageLoader from 'components/PageLoader';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { AsyncReducer, type TAsyncReducerOptions } from 'config/store';
import { ProtectedElement } from 'store/app';


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
            options={ asyncReducers as never }
            removeAfterUnmount
        >
            <Element />
        </AsyncReducer>
    );
});

const AppRouter: FC = () => {
    // const isAppReady = useAppSelector(({ app }) => app.isAppReady);

    const renderWithWrapper = useCallback(({
        asyncReducers, Element, path
    }: IRouterConfig) => {
        return (
            <Route
                key={ path }
                path={ path }
                element={ (
                    <ProtectedElement pathname={ path }>
                        <ElementWithWrapper
                            asyncReducers={ asyncReducers }
                            Element={ Element }
                        />
                    </ProtectedElement>
                ) }
            />
        );
    }, []);

    useRenderWatcher(AppRouter.name);

    return (
        <div className="page-wrapper">
            <Suspense fallback={ <PageLoader /> }>
                { /*  { isAppReady ? (*/ }
                <Routes>
                    { routesConfig.map(renderWithWrapper) }
                </Routes>
                { /*) : <PageLoader /> }*/ }
            </Suspense>
        </div>
    );
};

export default AppRouter;
