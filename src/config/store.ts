import { configureStore } from '@reduxjs/toolkit';
import { initialReducers, IStateSchema } from 'store';


export function createStore(initialState?: IStateSchema) {
    return configureStore<IStateSchema>({
        reducer: initialReducers,
        devTools: __IS_DEV__,
        preloadedState: initialState,
    });
}


type TStore = ReturnType<typeof createStore>;
export type TAppDispatch = TStore['dispatch'];