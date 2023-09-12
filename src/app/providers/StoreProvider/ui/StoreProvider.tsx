import {
    type FC, type ReactNode, useMemo
} from 'react';
import { type ReducersMapObject } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createStore, { type IStateSchema, StateSetupProvider } from 'config/store';
import { useAppNavigate } from 'shared/hooks/redux';
import { $stateSetup } from 'store/app';


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
    const navigate = useAppNavigate();
    const store = useMemo(() => {
        return createStore(initialState, asyncReducers, navigate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Provider store={ store }>
            <StateSetupProvider setUp={ $stateSetup }>
                { children }
            </StateSetupProvider>
        </Provider>
    );
};

export default StoreProvider;
