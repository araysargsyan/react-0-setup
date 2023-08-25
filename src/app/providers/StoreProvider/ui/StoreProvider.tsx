import { type FC, type ReactNode } from 'react';
import { type ReducersMapObject } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createStore, { type IStateSchema } from 'config/store';


interface IStoreProviderProps {
    children: ReactNode;
    initialState?: IStateSchema;
    asyncReducers?: ReducersMapObject<IStateSchema>;
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
