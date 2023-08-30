import {
    type FC,
    type PropsWithChildren,
    useCallback,
    useEffect,
    useRef
} from 'react';
import { useStore } from 'react-redux';
import { type IReduxStoreWithManager, type IStateSchema } from 'config/store';
import { useAppDispatch } from 'shared/hooks/redux';
import { type DeepPartial } from '@reduxjs/toolkit';


type TAsyncReducerOptionsParameters = Parameters<IReduxStoreWithManager['reducerManager']['add']>[0]
    & Parameters<IReduxStoreWithManager['reducerManager']['add']>[1];

export type TAsyncReducerOptions = TAsyncReducerOptionsParameters | (() => Promise<TAsyncReducerOptionsParameters>);

interface IAsyncReducerProps {
    options: TAsyncReducerOptions;
    state?: DeepPartial<IStateSchema>;
    removeAfterUnmount?: boolean;
}

const AsyncReducer: FC<PropsWithChildren<IAsyncReducerProps>> = ({
    children,
    options,
    state,
    removeAfterUnmount,
}) => {
    const store = useStore() as IReduxStoreWithManager;
    const dispatch = useAppDispatch();

    const getRemoveOptions = useCallback((o: TAsyncReducerOptionsParameters) => {
        return Array.isArray(o)
            ? o.map(({ key, parentKey }) => ({ key, parentKey }))
            : { key: o.key, parentKey: o.parentKey };
    }, []);

    const removeOptions = useRef(typeof options !== 'function'
        ? getRemoveOptions(options)
        : null
    );

    useEffect(() => {
        if (typeof options === 'function') {
            options().then((o) => {
                if (removeOptions.current === null) {
                    removeOptions.current = getRemoveOptions(o);
                }
                store.reducerManager.add(o, state);
                dispatch({ type: '@INIT:reducers', payload: removeOptions.current });
            });
        } else {
            store.reducerManager.add(options, state);
            dispatch({ type: '@INIT:reducers', payload: removeOptions.current });
        }

        
        return () => {
            if (removeAfterUnmount && removeOptions.current) {
                store.reducerManager.remove(removeOptions.current);
                dispatch({ type: '@DESTROY:reducers', payload: removeOptions });
            }
        };
        // eslint-disable-next-line
    }, []);

    return children;
};


export default AsyncReducer;
