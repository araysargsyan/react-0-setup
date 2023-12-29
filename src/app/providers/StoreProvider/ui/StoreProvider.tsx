import {
    type FC,
    type ReactNode,
    useEffect,
} from 'react';
import { type ReducersMapObject } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createStore, {
    type IStateSchema,
    type TAddAsyncReducerParameters,
    type TRemoveAsyncReducerParameters,
    RMActionCreators,
    useEnhancedStoreProvider,
    withEnhancedStoreProvider,
} from 'config/store';
import { StateSetupProvider } from 'store/app';
import RedirectionModal from 'components/RediretionModal';


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
    useEffect(() => {
        console.log('StoreProvider', {
            initialState,
            asyncReducers,
            withStateSetup
        });
    });
    const { getNavigate } = useEnhancedStoreProvider();
    const store = createStore(initialState as IStateSchema, asyncReducers, getNavigate);

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
                RedirectionModal={ RedirectionModal }
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

export default withEnhancedStoreProvider(StoreProvider);
