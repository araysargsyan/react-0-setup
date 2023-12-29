import {
    configureStore,
    type ReducersMapObject
} from '@reduxjs/toolkit';
import { initialReducers } from 'store';
import { $api } from 'shared/api';

import {
    type IStateSchema,
    type INestedStateSchema,
    type TStateWithoutNestedSchema,
    type IThunkExtraArg,
    type IReduxStoreWithManager
} from './types';
import ReducerManager from './lib/ReducerManager';


function createStore(
    initialState?: IStateSchema,
    asyncReducers?: ReducersMapObject<IStateSchema>,
    getNavigate?: IThunkExtraArg['getNavigate'],
) {
    const rootReducers: ReducersMapObject<IStateSchema> = {
        ...asyncReducers,
        ...initialReducers,
    };

    const reducerManager = ReducerManager.create<TStateWithoutNestedSchema, INestedStateSchema>(rootReducers);
    const extraArg: IThunkExtraArg = {
        api: $api,
        getNavigate,
    };

    const store = configureStore({
        reducer: reducerManager.reduce,
        devTools: __IS_DEV__,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(
            { thunk: { extraArgument: extraArg }, }
        ),
    }) as IReduxStoreWithManager;
    store.reducerManager = reducerManager;

    return store;
}

export type TCreateStore = typeof createStore;
export default createStore;
