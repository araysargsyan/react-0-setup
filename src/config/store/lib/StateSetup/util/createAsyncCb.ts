import { type Params } from 'react-router-dom';

import { type IAsyncCb, type TCb } from '../types';


export function createAsyncCb<
    T extends Record<string, ReturnType<TCb>> = Record<string, ReturnType<TCb>>,
    P extends Params<string> = Params<string>
>(
    moduleKey: string,
    getAction: IAsyncCb<T, P>['getAction']
): IAsyncCb {
    return {
        moduleKey: moduleKey,
        getAction: getAction as IAsyncCb['getAction']
    };
}
