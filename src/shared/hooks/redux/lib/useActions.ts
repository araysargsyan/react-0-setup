import { useMemo } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { watcher } from 'shared/hooks/useRenderWatcher';

import { useAppDispatch } from './core';
import {
    type TAction,
    type TModule,
    type TReturnedActions
} from '../types';


const useActions = <
    T extends TModule<T>,
    K extends keyof T = keyof T,
    R = TReturnedActions<T, K>
>(module: T, actionsKeys?: Array<keyof T>): R => {
    const dispatch = useAppDispatch();

    const actions = useMemo(() => {
        if (actionsKeys) {
            const boundActions: TModule<T> = {} as TModule<T>;
            actionsKeys.forEach((key) => {
                watcher('useActions', JSON.stringify((module[key] as any)?.type || (module[key] as any)?.typePrefix), 'HOOK');
                boundActions[key] = bindActionCreators((module[key] as TAction), dispatch);
            });

            return boundActions;
        } else {
            watcher('useActions', JSON.stringify({ actionsKeys: Object.keys(module) }), 'HOOK');
            return bindActionCreators(module, dispatch);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return actions as R;
};

export default useActions;
