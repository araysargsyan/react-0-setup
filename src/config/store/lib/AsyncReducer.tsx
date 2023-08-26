import {
    type FC, type PropsWithChildren, useEffect 
} from 'react';
import { useStore } from 'react-redux';
import { type IReduxStoreWithManager } from 'config/store';
import { useAppDispatch } from 'shared/hooks/redux';


export type TAsyncReducerOptions = Parameters<IReduxStoreWithManager['reducerManager']['add']>[0];

interface IAsyncReducerProps {
    options: TAsyncReducerOptions;
    removeAfterUnmount?: boolean;
}

export const AsyncReducer: FC<PropsWithChildren<IAsyncReducerProps>> = ({
    children,
    options,
    removeAfterUnmount, 
}) => {
    const store = useStore() as IReduxStoreWithManager;
    const dispatch = useAppDispatch();
    const removeOptions = Array.isArray(options)
        ? options.map(({ key, parentKey }) => ({ key, parentKey }))
        : { key: options.key, parentKey: options.parentKey };


    useEffect(() => {
        store.reducerManager.add(options);
        dispatch({ type: '@INIT:reducers', payload: removeOptions });
        
        return () => {
            if (removeAfterUnmount) {
                store.reducerManager.remove(removeOptions);
                dispatch({ type: '@DESTROY:reducers', payload: removeOptions });
            }
        };
        // eslint-disable-next-line
    }, []);

    return children;
};
