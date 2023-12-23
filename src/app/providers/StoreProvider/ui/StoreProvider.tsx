import {
    type FC,
    type ReactNode,
    useEffect,
    useMemo, useRef
} from 'react';
import { type ReducersMapObject } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createStore, {
    type IReduxStoreWithManager,
    type IStateSchema,
    type TAddAsyncReducerParameters,
    type TRemoveAsyncReducerParameters,
    RMActionCreators,
} from 'config/store';
import { useAppNavigate } from 'shared/hooks/redux';
import { createRedirectionModal, StateSetupProvider } from 'store/app';
import Modal from 'shared/ui/Modal';
import Portal from 'shared/ui/Portal';
import { flowState } from 'config/store/lib/StateSetup/core/StateSetup';


interface IStoreProviderProps {
    children: ReactNode;
    initialState?: DeepPartial<IStateSchema>;
    asyncReducers?: ReducersMapObject<IStateSchema>;
    withStateSetup?: boolean;
}

const RedirectionModal = createRedirectionModal(({ useContext }) => {
    const {
        show,
        context,
        closeRedirectionModal
    } = useContext();
    const isClosed = useRef(false);
    console.log('%c____RedirectModal_____', 'color:#0465cd', !show ? 'NULL' : 'MODAL', { show, context });

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                console.log('%c____RedirectModal_____', 'color:#0465cd', 'CLOSE', { show, context });
                isClosed.current = true;
                closeRedirectionModal();
            }, 3200);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ closeRedirectionModal, show ]);

    useEffect(() => {
        console.log('%c____RedirectModal_____: UPDATE', 'color:#0465cd', !show ? 'NULL' : 'MODAL', { show, context });
        context?.type && flowState['useEffect: Update'].____RedirectModal_____.types.push(context.type as never);
        flowState['useEffect: Update'].____RedirectModal_____[!show ? 'NULL' : 'MODAL']
            = flowState['useEffect: Update'].____RedirectModal_____[!show ? 'NULL' : 'MODAL'] + 1;

        if (isClosed.current) {
            isClosed.current = false;
            console.log('$flowState', flowState.get());
            flowState.reset();
        }
    });

    if (!show) {
        return null;
    }

    return (
        <Portal>
            <Modal isOpen={ show }>
                <h1>REDIRECTING</h1>
                <h2>redirectTo: { context?.redirectTo }</h2>
                <h2>from: { context?.from }</h2>
                <h2>type: { context?.type }</h2>
                <h2>isPageLoaded: { String(context?.isPageLoaded) }</h2>
            </Modal>
        </Portal>
    );
});

const StoreProvider:FC<IStoreProviderProps> = ({
    children,
    initialState,
    asyncReducers,
    withStateSetup = true
}) => {
    // const navigate = useAppNavigate();
    const store = useMemo(() => {
        return createStore(initialState as IStateSchema, asyncReducers/*, navigate*/) as IReduxStoreWithManager;
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
                RedirectionModal={ RedirectionModal }
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
