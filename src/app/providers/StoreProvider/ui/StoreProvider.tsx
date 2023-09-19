import {
    type FC,
    type ReactNode,
    useMemo
} from 'react';
import { type ReducersMapObject } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createStore, {
    type IReduxStoreWithManager,
    type IStateSchema,
    type TAddAsyncReducerParameters,
    type TRemoveAsyncReducerParameters,
    RMActionCreators,
    StateSetupProvider
} from 'config/store';
import { useAppNavigate } from 'shared/hooks/redux';
import {
    $checkAuthorization, $stateSetup, appActionCreators 
} from 'store/app';


interface IStoreProviderProps {
    children: ReactNode;
    initialState?: DeepPartial<IStateSchema>;
    asyncReducers?: ReducersMapObject<IStateSchema>;
    withStateSetup?: boolean;
}

const StoreProvider:FC<IStoreProviderProps> = ({
    children,
    initialState,
    asyncReducers,
    withStateSetup = true
}) => {
    const navigate = useAppNavigate();
    const store = useMemo(() => {
        return createStore(initialState as IStateSchema, asyncReducers, navigate) as IReduxStoreWithManager;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!withStateSetup) {
        return (
            <Provider store={ store }>
                { children }
            </Provider>
        );
    }

    return (
        <Provider store={ store }>
            <StateSetupProvider
                setUp={ $stateSetup }
                checkAuthorization={ $checkAuthorization }
                asyncReducer={{
                    async add(dispatch, options) {
                        store.reducerManager.add(...options as TAddAsyncReducerParameters);
                        dispatch(RMActionCreators.initReducers());
                    },
                    async remove(dispatch, options) {
                        store.reducerManager.remove(...options as TRemoveAsyncReducerParameters);
                        dispatch(RMActionCreators.destroyReducers());
                    },
                }}
            >
                { children }
            </StateSetupProvider>
        </Provider>
    );
};

export default StoreProvider;
