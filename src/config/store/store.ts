import {
    type CombinedState,
    configureStore,
    type Reducer,
    type ReducersMapObject
} from '@reduxjs/toolkit';
import { initialReducers } from 'store';
import { $api } from 'shared/api';

import {
    type IStateSchema,
    type INestedStateSchema,
    type TStateWithoutNestedSchema,
    type IThunkExtraArg
} from './types';
import ReducerManager from './lib/ReducerManager';


function createStore(
    initialState?: IStateSchema,
    asyncReducers?: ReducersMapObject<IStateSchema>,
    navigate?: IThunkExtraArg['navigate'],
) {
    const rootReducers: ReducersMapObject<IStateSchema> = {
        ...asyncReducers,
        ...initialReducers,
    };

    const reducerManager = ReducerManager.create<TStateWithoutNestedSchema, INestedStateSchema>(rootReducers);
    const extraArg: IThunkExtraArg = {
        api: $api,
        navigate,
    };

    const store = configureStore({
        reducer: reducerManager.reduce as Reducer<CombinedState<IStateSchema>>,
        devTools: __IS_DEV__,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(
            { thunk: { extraArgument: extraArg }, }
        ),
    });

    // @ts-ignore
    store.reducerManager = reducerManager;

    return store;
}

export type TCreateStore = typeof createStore;
export default createStore;
