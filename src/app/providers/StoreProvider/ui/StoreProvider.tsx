import {
    type FC,
    type ReactNode, useEffect,
    useMemo, useState
} from 'react';
import { type ReducersMapObject } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createStore, {
    type IReduxStoreWithManager,
    type IStateSchema,
    type TAddAsyncReducerParameters,
    type TRemoveAsyncReducerParameters,
    RMActionCreators,
    StateSetupProvider
} from 'config/store';
import { useAppNavigate } from 'shared/hooks/redux';
import { usePageStateSetup } from 'store/app';
import Modal from 'shared/ui/Modal';
import Portal from 'shared/ui/Portal';


interface IStoreProviderProps {
    children: ReactNode;
    initialState?: DeepPartial<IStateSchema>;
    asyncReducers?: ReducersMapObject<IStateSchema>;
    withStateSetup?: boolean;
}

const Aa:FC<{
    show: boolean;
    context: {
        redirectTo: string | null;
        from: string;
    };
}> = ({ show, context }) => {
    const [ isOpen, setIsOpen ] = useState(false);

    useEffect(() => {
        if (show) {
            setIsOpen(true);
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);
        }
    }, [ show ]);
    console.log({
        isOpen, show, redirectTo: context.redirectTo, from: context.from
    }, 66666);

    if (!isOpen) {
        return null;
    }

    return (
        <Portal>
            <Modal isOpen={ isOpen }>
                <h1>REDIRECTING</h1>
                <h2>redirectTo: { context.redirectTo }</h2>
                <h2>from: { context.from }</h2>
            </Modal>
        </Portal>
    );
};

const StoreProvider:FC<IStoreProviderProps> = ({
    children,
    initialState,
    asyncReducers,
    withStateSetup = true
}) => {
    const navigate = useAppNavigate();
    const store = useMemo(() => {
        return createStore(initialState as IStateSchema, asyncReducers, navigate) as IReduxStoreWithManager;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!withStateSetup) {
        return (
            <Provider store={ store }>
                { children }
            </Provider>
        );
    }

    return (
        <Provider store={ store }>
            <StateSetupProvider
                usePageStateSetup={ usePageStateSetup }
                RedirectionModal={ Aa }
                asyncReducer={{
                    async add(dispatch, options) {
                        store.reducerManager.add(...options as TAddAsyncReducerParameters);
                        dispatch(RMActionCreators.initReducers());
                    },
                    async remove(dispatch, options) {
                        store.reducerManager.remove(...options as TRemoveAsyncReducerParameters);
                        dispatch(RMActionCreators.destroyReducers());
                    },
                }}
            >
                { children }
            </StateSetupProvider>
        </Provider>
    );
};

export default StoreProvider;
