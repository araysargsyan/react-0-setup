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
import { useAppSelector } from 'shared/hooks/redux';


interface IElementWithWrapper {
    asyncReducers?: TAsyncReducerOptions;
    Element: ComponentType;
}

const As = ({ a }: {a: boolean}) => {
    const loading = useAppSelector(({ app }) => app.loading);
    if (a) {
        return !loading ? <PageLoader /> : null;
    } else {
        return loading ? <PageLoader /> : null;
    }
};

const ElementWithWrapper = memo<IElementWithWrapper>(function ElementWithWrapper(
    { asyncReducers, Element }
) {

    if (!asyncReducers) {
        return (
            <>
                <Element />
            </>
        );
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
            <>
                <As a={ false } />
                <Suspense fallback={ <As a={ true } /> }>
                    <Routes>
                        { routesConfig.map(renderWithWrapper) }
                    </Routes>
                </Suspense>
            </>
        </div>
    );
};

export default AppRouter;
