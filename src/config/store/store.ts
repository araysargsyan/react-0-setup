import { configureStore, type ReducersMapObject } from '@reduxjs/toolkit';
import { initialReducers } from 'store';

import {
    type IStateSchema,
    type INestedStateSchema,
    type TStateWithoutNestedSchema
} from './types';
import ReducerManager from './lib/ReducerManager';


function createStore(
    initialState?: IStateSchema,
    asyncReducers?: ReducersMapObject<IStateSchema>
) {

    const rootReducers: ReducersMapObject<IStateSchema> = {
        ...asyncReducers,
        ...initialReducers,
    };

    const reducerManager = ReducerManager.create<TStateWithoutNestedSchema, INestedStateSchema>(rootReducers);

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
