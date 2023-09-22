import {
    type FC,
    type PropsWithChildren,
    Suspense,
    useCallback,
    useEffect,
    useRef
} from 'react';
import { useDispatch, useStore } from 'react-redux';
import { type DeepPartial } from '@reduxjs/toolkit';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

import { type IState, type IStore } from './types';
import { RMActionCreators } from '.';


type TAddAsyncReducerParameters = Parameters<IStore['reducerManager']['add']>;
type TAsyncReducerOptions = TAddAsyncReducerParameters[0] | ((state?: DeepPartial<IState>) => Promise<TAddAsyncReducerParameters[0]>);

interface IAsyncReducerProps {
    options: TAsyncReducerOptions;
    state?: TAddAsyncReducerParameters[1];
    removeAfterUnmount?: boolean;
}

const AsyncReducer: FC<PropsWithChildren<IAsyncReducerProps>> = ({
    children,
    options,
    state,
    removeAfterUnmount,
}) => {
    const store = useStore() as IStore;
    const dispatch = useDispatch();
    const isInitieted = useRef(false);

    const getRemoveOptions = useCallback((o: TAddAsyncReducerParameters[0]) => {
        return Array.isArray(o)
            ? o.map(({ key, parentKey }) => ({ key, parentKey }))
            : { key: o.key, parentKey: o.parentKey };
    }, []);

    const removeOptions = useRef(typeof options !== 'function'
        ? getRemoveOptions(options)
        : null
    );

    useRenderWatcher(AsyncReducer.name, JSON.stringify(removeOptions));
    useEffect(() => {
        if (typeof options === 'function') {
            options().then((o) => {
                if (removeOptions.current === null) {
                    removeOptions.current = getRemoveOptions(o);
                }
                store.reducerManager.add(o, state);
                dispatch(RMActionCreators.initReducers());
            });
        } else {
            store.reducerManager.add(options, state);
            dispatch(RMActionCreators.initReducers);
        }

        return () => {
            if (removeAfterUnmount && removeOptions.current) {
                store.reducerManager.remove(removeOptions.current);
                dispatch(RMActionCreators.destroyReducers());
            }
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (isInitieted.current) {
            dispatch(RMActionCreators.updateState(state));
        } else {
            isInitieted.current = true;
        }
    }, [ state, dispatch ]);


    return (
        //! must be suspended before the reducers are initialized
        children
    );
};


export default AsyncReducer;
