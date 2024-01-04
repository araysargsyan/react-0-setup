import {
    configureStore,
    type ReducersMapObject
} from '@reduxjs/toolkit';
import { initialReducers } from 'store';
import { $api } from 'shared/api';
import { getScrollPositionActionType } from 'store/UI';

import { type IEnhancedStoreProviderValue } from './lib/EnhancedStore';
import {
    type IStateSchema,
    type INestedStateSchema,
    type TStateWithoutNestedSchema,
    type IThunkExtraArg,
    type TReduxStoreWithManager
} from './types';
import ReducerManager from './lib/ReducerManager';


function createStore(
    initialState?: IStateSchema,
    asyncReducers?: ReducersMapObject<IStateSchema>,
    extra?: IEnhancedStoreProviderValue,
) {
    const rootReducers: ReducersMapObject<IStateSchema> = {
        ...asyncReducers,
        ...initialReducers,
    };

    const reducerManager = ReducerManager.create<TStateWithoutNestedSchema, INestedStateSchema>(rootReducers);
    const extraArg: IThunkExtraArg = {
        api: $api,
        ...extra,
    };

    const store = configureStore({
        reducer: reducerManager.reduce,
        devTools: __IS_DEV__,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(
            { thunk: { extraArgument: extraArg }, }
        ).concat((_) => (next) => (action) => {
            if (action.type === `${getScrollPositionActionType}/pending`) {
                return;
            } else if (action.type === `${getScrollPositionActionType}/fulfilled`) {
                action.type = getScrollPositionActionType;
            }
            return next(action);
        }),
    });

    return {
        ...store,
        reducerManager
    } as TReduxStoreWithManager<typeof store>;
}

export type TCreateStore = typeof createStore;
export default createStore;
