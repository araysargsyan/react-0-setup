import { configureStore, type ReducersMapObject } from '@reduxjs/toolkit';
import { type IAsyncStateSchema, initialReducers } from 'store';

import {
    type IStateSchema,
    type IDefaultStateSchema,
    type INestedStateSchema
} from './types';
import ReducerManager from './lib';


function createStore(
    initialState?: IStateSchema,
    asyncReducers?: ReducersMapObject<IAsyncStateSchema>
) {
    const rootReducers: ReducersMapObject<IStateSchema> = {
        ...asyncReducers,
        ...initialReducers
    };

    const reducerManager = ReducerManager.create<IDefaultStateSchema, INestedStateSchema>(rootReducers);

    const store = configureStore<IStateSchema>({
        reducer: reducerManager.reduce,
        devTools: __IS_DEV__,
        preloadedState: initialState,
    });

    // @ts-ignore
    store.reducerManager = reducerManager;

    return store;
}

export type TCreateStore = typeof createStore;
export default createStore;
