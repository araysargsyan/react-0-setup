import { FC, type ReactNode } from 'react';
import { DeepPartial } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createStore } from 'app/config/store';
import { IStateSchema } from 'app/store';


interface IStoreProviderProps {
    children: ReactNode;
    initialState?: DeepPartial<IStateSchema>;
} 

const StoreProvider:FC<IStoreProviderProps> = ({ children, initialState }) => {
    const store = createStore(initialState as IStateSchema);

    return (
        <Provider store={ store }>
            { children }
        </Provider>
    );
};

export default StoreProvider;
