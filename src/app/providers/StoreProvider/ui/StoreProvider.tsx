import { type FC, type ReactNode } from 'react';
import { type ReducersMapObject } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createStore, { type IStateSchema } from 'config/store';
import { useNavigate } from 'react-router-dom';


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
    const navigate = useNavigate();

    const store = createStore(initialState, asyncReducers, navigate);

    return (
        <Provider store={ store }>
            { children }
        </Provider>
    );
};

export default StoreProvider;
