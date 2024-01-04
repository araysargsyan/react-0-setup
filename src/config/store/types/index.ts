import { type EnhancedStore } from '@reduxjs/toolkit';
import { type IInitialStateSchema } from 'store';
import { type IFormStateSchema } from 'features/forms';
import { type AxiosInstance } from 'axios';

import { type IEnhancedStoreProviderValue } from '../lib/EnhancedStore';
import { type TAsyncReducerType, type IReducerManager } from '../lib/ReducerManager';
import { type TCreateStore } from '../store';


export interface INestedStateSchema {
    forms: Partial<IFormStateSchema>;
}
export interface IStateSchema extends IInitialStateSchema, Partial<INestedStateSchema> {}
export type TStateWithoutNestedSchema = Omit<IStateSchema, keyof INestedStateSchema>;

export type TAppDispatch = ReturnType<TCreateStore>['dispatch'];
export type TReduxStoreWithManager<STORE extends EnhancedStore<IStateSchema> = EnhancedStore<IStateSchema>> = STORE & {
    reducerManager: IReducerManager<TStateWithoutNestedSchema, INestedStateSchema>;
};
export type TAsyncReducerOptions<
    TYPE extends 'cb' | 'obj' | null = null
> = TAsyncReducerType<
    TYPE,
    Parameters<TReduxStoreWithManager['reducerManager']['add']>[0],
    Parameters<TReduxStoreWithManager['reducerManager']['add']>[1],
    IStateSchema
>;

export interface IThunkExtraArg extends Partial<IEnhancedStoreProviderValue> {
    api: AxiosInstance;
}

export interface IThunkConfig<R> {
    rejectValue: R;
    dispatch: TAppDispatch;
    state: IStateSchema;
    extra: IThunkExtraArg;
}
