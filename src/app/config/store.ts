import { configureStore } from '@reduxjs/toolkit';
import { initialReducers, IStateSchema } from 'app/store';


export function createStore(initialState?: IStateSchema) {
    return configureStore<IStateSchema>({
        reducer: initialReducers,
        devTools: __IS_DEV__,
        preloadedState: initialState,
    });
}
