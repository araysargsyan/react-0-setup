import { type TAsyncReducersOptionsReturn, type TStateSetupFn } from '../types';


export function createStateSetupConfig<
T extends string = string,
AR extends TAsyncReducersOptionsReturn = TAsyncReducersOptionsReturn
>(cb: TStateSetupFn<T, AR>): TStateSetupFn<T, AR> {
    return cb;
}
