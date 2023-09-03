import { useMemo } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { type ActionCreator } from 'redux';

import { type TModule, type TReturnedActions } from '../types';
import { useAppDispatch } from './core';


const useActions = <
    T extends TModule<T>,
    K extends keyof T = keyof T,
    R = TReturnedActions<T, K>
>(module: T, actionsKeys?: Array<keyof T>): R => {
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

export default useActions;
