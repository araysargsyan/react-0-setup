import {
    useCallback,
    useEffect,
    useRef
} from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { watcher } from 'shared/hooks/useRenderWatcher';

import {
    type TAsyncModule,
    type TModule,
    type TReturnedActions,
    type TUseDynamicActionsOptions
} from '../types';
import { useAppDispatch } from './core';


const useDynamicActions = <
    T extends TModule<T>,
    IM extends TAsyncModule<T> = TAsyncModule<T>
>(importModule: IM, options: TUseDynamicActionsOptions) => {
    const {
        moduleKey = 'default',
        when = true,
        deps = []
    } = options;
    const dispatch = useAppDispatch();
    const isModuleLoaded = useRef(false);

    useEffect(() => {
        if (when) {
            importModule()
                .then(() => {
                    isModuleLoaded.current = true;
                })
                .catch((e) => {
                    console.log('__CUSTOM__::load dynamic module', e);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);


    const getAction = useCallback(async <
        K extends keyof T,
        R extends TReturnedActions<T, K> = TReturnedActions<T, K>
    >(key: K): Promise<(...args: Parameters<R[K]>) => R[K]> => {
        return await importModule().then(modules => (modules[moduleKey] as R)[key]) as (...args: Parameters<R[K]>) => R[K];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);




    const getAsyncAction = useCallback(<
        K extends keyof T,
        R extends TReturnedActions<T, K> = TReturnedActions<T, K>
    >(key: K): (...args: Parameters<R[K]>) => Promise<R[K]> => {
        watcher('useDynamicActions::getAsyncAction', JSON.stringify({ actionKey: key, }), 'HOOK');

        return async (...args) => {
            if (!isModuleLoaded.current) return {} as R[K];
            const action = await getAction<K, R>(key);
            const boundAction = bindActionCreators(action, dispatch);
            return boundAction(...args) ;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return getAsyncAction;
};

export default useDynamicActions;
