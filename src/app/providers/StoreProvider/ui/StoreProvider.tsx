import {
    type FC,
    type ReactNode, useCallback,
    useEffect,
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

    const filterReducers = useCallback((
        method: 'add' | 'remove',
        moduleNames: {
            prev?: string[];
            current?: string[];
        },
        reducerOptions: TAsyncReducerOptions<'obj'>['reducerOptions']
    ) => {
        let filteredReducerOptions;
        const MN = method === 'add' ? moduleNames.prev : moduleNames.current;

        if (MN?.length) {
            if (Array.isArray(reducerOptions)) {
                filteredReducerOptions = MN
                    ? reducerOptions.filter((opt) => !MN?.includes(opt.key))
                    : reducerOptions;
                if (!filteredReducerOptions.length) {
                    filteredReducerOptions = null;
                }
            } else {
                filteredReducerOptions = MN?.includes(reducerOptions?.key)
                    ? null
                    : reducerOptions;
            }
        } else {
            filteredReducerOptions = reducerOptions;
        }

        return filteredReducerOptions;
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
                RedirectionModal={ RedirectionModal }
                asyncReducer={{
                    async add(
                        { dispatch },
                        { reducerOptions, state }: TAsyncReducerOptions<'obj'>,
                        moduleNames
                    ) {
                        const filteredReducerOptions = filterReducers(
                            'add',
                            moduleNames,
                            reducerOptions
                        );

                        if (filteredReducerOptions) {
                            store.reducerManager.add(filteredReducerOptions, state);
                            dispatch(RMActionCreators.initReducers());
                        }
                    },
                    async remove(
                        { dispatch },
                        { reducerOptions }: TAsyncReducerOptions<'obj'>,
                        moduleNames
                    ) {
                        const filteredReducerOptions = filterReducers(
                            'remove',
                            moduleNames,
                            reducerOptions
                        );

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
