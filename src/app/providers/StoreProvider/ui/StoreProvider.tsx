import {
    type FC,
    type ReactNode,
    useEffect, useRef,
} from 'react';
import { type ReducersMapObject } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createStore, {
    type IStateSchema,
    type TAsyncReducerOptions,
    RMActionCreators,
    useEnhancedStoreProvider,
    withEnhancedStoreProvider,
} from 'config/store';
import { StateSetupProvider } from 'store/app';
import RedirectionModal from 'components/RediretionModal';
import { type IScroll } from 'store/UI';


interface IStoreProviderProps {
    children: ReactNode;
    initialState?: DeepPartial<IStateSchema>;
    asyncReducers?: ReducersMapObject<IStateSchema>;
    withStateSetup?: boolean;
}


const StoreProvider:FC<IStoreProviderProps> = ({
    children,
    initialState = {},
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
    const store = createStore(
        initialState as IStateSchema,
        asyncReducers,
        useEnhancedStoreProvider()
    );

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
                    async add(dispatch, { reducerOptions, state }: TAsyncReducerOptions<'obj'>) {
                        store.reducerManager.add(reducerOptions, state);
                        dispatch(RMActionCreators.initReducers());
                    },
                    async remove(dispatch, { reducerOptions }: TAsyncReducerOptions<'obj'>, prevModuleNames) {
                        let filteredReducerOptions;
                        if (Array.isArray(reducerOptions)) {
                            filteredReducerOptions = reducerOptions.filter((opt) => !prevModuleNames?.includes(opt.key));
                            if (!filteredReducerOptions.length) {
                                filteredReducerOptions = null;
                            }
                        } else {
                            filteredReducerOptions = prevModuleNames?.includes(reducerOptions?.key) ? null : reducerOptions;
                        }
                        if (filteredReducerOptions) {
                            store.reducerManager.remove(filteredReducerOptions);
                            dispatch(RMActionCreators.destroyReducers());
                        }
                    },
                }}
            >
                { children }
            </StateSetupProvider>
        </Provider>
    );
};

export default withEnhancedStoreProvider(StoreProvider);
