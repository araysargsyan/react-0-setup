import { configureStore, type ReducersMapObject } from '@reduxjs/toolkit';
import { type IAsyncStateSchema, initialReducers } from 'store';
import { formReducers } from 'features';

import { type IStateSchema } from './types';
import ReducerManager from './lib';


function createStore(
    initialState?: IStateSchema,
    asyncReducers?: ReducersMapObject<IAsyncStateSchema>
) {
    const rootReducers: ReducersMapObject<IStateSchema> = {
        ...asyncReducers,
        ...initialReducers
    };


    const reducerManager = (new ReducerManager(
        rootReducers,
        { forms: formReducers })
    ).create();

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
