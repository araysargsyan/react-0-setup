import { type InferThunkActionCreatorType, useDispatch } from 'react-redux';
import { type TAppDispatch } from 'config/store';
import {
    type DependencyList,
    useCallback,
    useEffect, useMemo,
    useRef,
} from 'react';
import { type AsyncThunkAction, bindActionCreators, } from '@reduxjs/toolkit';
import { type ActionCreator } from 'redux';


export const useAppDispatch = () => useDispatch<TAppDispatch>();

type TAction = ActionCreator<any> | AsyncThunkAction<any, any, any>;
type TModule<T> = { [K in keyof T]: TAction };
type TAsyncModule<T extends TModule<T>> = () => Promise<
    { [K in string]: TModule<T> | unknown }
    & {default: unknown}
>;
type TReturnedActions<T extends TModule<T>, K extends keyof T> = {
    [KEY in K]: ReturnType<T[KEY]> extends AnyFunction ? InferThunkActionCreatorType<T[KEY]> : T[KEY]
};


export const useActions = <
    T extends TModule<T>,
    K extends keyof T = keyof T,
    R = TReturnedActions<T, K>
>(
        module: T,
        actionsKeys?: Array<keyof T>,
    ): R => {
    console.log('_________useActions____________');

    const dispatch = useAppDispatch();

    const actions = useMemo(() => {
        console.log('666666666666666666666666666666666666666666');
        if (actionsKeys) {
            const boundActions: TModule<T> = {} as TModule<T>;
            actionsKeys.forEach((key) => {
                boundActions[key] = bindActionCreators((module[key] as ActionCreator<any>), dispatch);
            });

            return boundActions;
        } else {
            return bindActionCreators(module, dispatch);
        }
    }, [ actionsKeys, dispatch, module ]);
    
    return actions as R;
};



type TUseDynamicActionsOptions = {
    moduleKey: string;
    when?: boolean;
    deps?: DependencyList;
};
export const useDynamicActions = <
    T extends TModule<T>,
    I extends TAsyncModule<T> = TAsyncModule<T>
>(importModule: I, options: TUseDynamicActionsOptions) => {
    console.log('_________useDynamicActions____________');
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
        return await importModule().then(modules => (modules[moduleKey] as R)[key]);
    }, [ importModule, moduleKey ]);

    const getAsyncAction = useCallback(<
        K extends keyof T,
        R extends TReturnedActions<T, K> = TReturnedActions<T, K>
    >(key: K): (...args: Parameters<R[K]>) => Promise<R[K]> => {
        console.log('666666666666666666666666666666666666666666');

        return async (...args) => {
            if (!isModuleLoaded.current) return {} as R[K];
            const action = await getAction<K, R>(key);
            const boundAction = bindActionCreators(action, dispatch);
            return boundAction(...args) ;
        };
    }, [ dispatch, getAction ]);

    return getAsyncAction;
};
