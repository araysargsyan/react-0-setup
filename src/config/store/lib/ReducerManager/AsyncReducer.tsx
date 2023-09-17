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
type TAsyncReducerOptions = TAddAsyncReducerParameters | ((state?: DeepPartial<IState>) => Promise<TAddAsyncReducerParameters>);

interface IAsyncReducerProps {
    options: TAsyncReducerOptions;
    // state?: DeepPartial<IStateSchema>;
    removeAfterUnmount?: boolean;
}

const AsyncReducer: FC<PropsWithChildren<IAsyncReducerProps>> = ({
    children,
    options,
    // state,
    removeAfterUnmount,
}) => {
    const store = useStore() as IStore;
    const dispatch = useDispatch();

    const getRemoveOptions = useCallback((o: TAddAsyncReducerParameters) => {
        return Array.isArray(o[0])
            ? o[0].map(({ key, parentKey }) => ({ key, parentKey }))
            : { key: o[0].key, parentKey: o[0].parentKey };
    }, []);

    const removeOptions = useRef(typeof options !== 'function'
        ? getRemoveOptions(options)
        : null
    );

    useRenderWatcher(AsyncReducer.name, JSON.stringify(options));
    useEffect(() => {
        if (typeof options === 'function') {
            options().then((o) => {
                if (removeOptions.current === null) {
                    removeOptions.current = getRemoveOptions(o);
                }
                store.reducerManager.add(...o);
                dispatch(RMActionCreators.initReducers());
            });
        } else {
            store.reducerManager.add(...options);
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

    return (
        //! must be suspended before the reducers are initialized
        <Suspense
            fallback={ 'AsyncReducer' }
            children={ children }
        />
    );
};


export default AsyncReducer;
