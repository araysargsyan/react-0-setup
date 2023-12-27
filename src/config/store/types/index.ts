import { type DeepPartial, type EnhancedStore } from '@reduxjs/toolkit';
import { type IInitialStateSchema } from 'store';
import { type IFormStateSchema } from 'features/forms';
import { type AxiosInstance } from 'axios';
import { type TAppNavigateFunction } from 'shared/hooks/redux';

import { type IReducerManager } from '../lib/ReducerManager';
import { type TCreateStore } from '../store';


export interface INestedStateSchema {
    forms: Partial<IFormStateSchema>;
}
export interface IStateSchema extends IInitialStateSchema, Partial<INestedStateSchema> {}
export type TStateWithoutNestedSchema = Omit<IStateSchema, keyof INestedStateSchema>;

export type TStore = ReturnType<TCreateStore>;
export type TAppDispatch = TStore['dispatch'];
export interface IReduxStoreWithManager extends EnhancedStore<IStateSchema> {
    reducerManager: IReducerManager<TStateWithoutNestedSchema, INestedStateSchema>;
}
export type TAddAsyncReducerParameters = Parameters<IReduxStoreWithManager['reducerManager']['add']>;
export type TRemoveAsyncReducerParameters = Parameters<IReduxStoreWithManager['reducerManager']['remove']>;
export type TAddAsyncReducerOp = TAddAsyncReducerParameters[0] | ((state?: IStateSchema) => Promise<TAddAsyncReducerParameters[0]>);
// export type TAsyncReducerOptions = TAddAsyncReducerParameters
//     | ((state?: DeepPartial<IStateSchema>) => Promise<TAddAsyncReducerParameters>);
export type TAsyncReducerOptions<T extends boolean = false> = T extends false
    ? TAddAsyncReducerParameters | ((state?: DeepPartial<IStateSchema>) => Promise<TAddAsyncReducerParameters>)
    : (state?: DeepPartial<IStateSchema>) => Promise<TAddAsyncReducerParameters>;
export interface IThunkExtraArg {
    api: AxiosInstance;
    getNavigate?: () => TAppNavigateFunction;
}

export interface IThunkConfig<R> {
    rejectValue: R;
    dispatch: TAppDispatch;
    state: IStateSchema;
    extra: IThunkExtraArg;
}
