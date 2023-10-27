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
    mustShow: any;
    useContext: any;
    // context: {
    //     redirectTo: string | null;
    //     from: string;
    // };
    // closeRedirectionModal: any;
}> = ({ mustShow, useContext }) => {
    const show = mustShow();
    const { context, closeRedirectionModal } = useContext();
    // const [ closed, close ] = useState(false);
    // const [ _, rerender ] = useState(0);

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                console.log(6666);
                // rerender((prevState) => prevState + 1);
                closeRedirectionModal();
                // close(true);
            }, 3000);
        }
    }, [ closeRedirectionModal, show ]);
    console.log('____RedirectModal_____', /*closed ||*/ !show ? 'NULL' : 'MODAL', { show, context }
    );

    useEffect(() => {
        console.log('____RedirectModal_____: UPDATE', /*closed ||*/ !show ? 'NULL' : 'MODAL', { show, context });
    });

    if (/*closed ||*/ !show) {
        return null;
    }

    return (
        <Portal>
            <Modal isOpen={ show }>
                <h1>REDIRECTING</h1>
                <h2>redirectTo: { context?.redirectTo }</h2>
                <h2>from: { context?.from }</h2>
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
