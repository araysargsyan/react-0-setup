import {
    type TReduxStoreWithManager,
    type IStateSchema,
    type TAsyncReducerOptions,
    RMActionCreators,
} from 'config/store';
import {
    type FC,
    type PropsWithChildren,
    useCallback,
    useLayoutEffect,
    useRef
} from 'react';
import { useDispatch, useStore } from 'react-redux';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';




interface IAsyncReducerProps {
    options: TAsyncReducerOptions;
    removeAfterUnmount?: boolean;
}

const AsyncReducerProvider: FC<PropsWithChildren<IAsyncReducerProps>> = ({
    children,
    options,
    removeAfterUnmount,
}) => {
    const store = useStore() as TReduxStoreWithManager;
    const dispatch = useDispatch();
    const isInitiated = useRef(false);

    const getRemoveOptions = useCallback((o: TAsyncReducerOptions<'obj'>['reducerOptions']) => {
        return Array.isArray(o)
            ? o.map(({ key, parentKey }) => ({ key, parentKey }))
            : { key: o.key, parentKey: o.parentKey };
    }, []);
    const updateState = useCallback((state?: DeepPartial<IStateSchema>) => {
        if (isInitiated.current) {
            dispatch(RMActionCreators.updateState(state));
        } else {
            isInitiated.current = true;
        }
    }, [ dispatch ]);

    const removeOptions = useRef(typeof options !== 'function'
        ? getRemoveOptions(options.reducerOptions)
        : null
    );


    useLayoutEffect(() => {
        if (typeof options === 'function') {
            options(store.getState()).then(({ reducerOptions, state }) => {
                if (removeOptions.current === null) {
                    removeOptions.current = getRemoveOptions(reducerOptions);
                }
                store.reducerManager.add(reducerOptions, state);
                dispatch(RMActionCreators.initReducers());
                updateState(state);
            });
        } else {
            store.reducerManager.add(options.reducerOptions, options.state);
            dispatch(RMActionCreators.initReducers());
            updateState(options.state);
        }

        return () => {
            if (removeAfterUnmount && removeOptions.current) {
                store.reducerManager.remove(removeOptions.current);
                dispatch(RMActionCreators.destroyReducers());
            }
        };
        // eslint-disable-next-line
    }, []);

    useRenderWatcher(AsyncReducerProvider.name, JSON.stringify(removeOptions));

    return (
        //? must be suspended before the reducers are initialized
        children
    );
};

export default AsyncReducerProvider;
