import {
    type FC, type ReactNode, useEffect 
} from 'react';
import { type ReducersMapObject } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { type IAsyncStateSchema } from 'store';
import createStore, { type IStateSchema } from 'config/store';


interface IStoreProviderProps {
    children: ReactNode;
    initialState?: IStateSchema;
    asyncReducers?: ReducersMapObject<IAsyncStateSchema>;
}

const StoreProvider:FC<IStoreProviderProps> = ({
    children,
    initialState,
    asyncReducers
}) => {

    const store = createStore(initialState, asyncReducers);

    return (
        <Provider store={ store }>
            { children }
        </Provider>
    );
};

export default StoreProvider;
