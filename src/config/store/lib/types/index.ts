import {
    type AnyAction,
    type CombinedState,
    type Reducer,
    type ReducersMapObject
} from '@reduxjs/toolkit';
import { type IStateSchema, type INestedStateSchema } from 'config/store';


export type TSchema = Record<string, any>;

export interface INested<M = false> {
    [key: string | never]: M extends true ? ReducersMapObject<TSchema> : TSchema;
}

export interface IState extends TSchema {}


export type TParentStateKeys = keyof INestedStateSchema;
export type TAsyncStateKeys = keyof Omit<IStateSchema, TParentStateKeys>;
export type TNestedStateKeys = keyof IStateSchema[TParentStateKeys];
export interface IAddReducersOptions {
    key: TAsyncStateKeys | TNestedStateKeys;
    parentKey?: TParentStateKeys;
    reducer: Reducer;
}
export interface IRemoveReducersOptions {
    key: TAsyncStateKeys | TNestedStateKeys;
    parentKey?: TParentStateKeys;
}

export interface IReducerManager {
    getReducerMap: () => ReducersMapObject<IStateSchema>;
    reduce: (state: IStateSchema, action: AnyAction) => CombinedState<IStateSchema>;
    add: (options: IAddReducersOptions | IAddReducersOptions[]) => void;
    remove: (options: IRemoveReducersOptions | IRemoveReducersOptions[]) => void;
}
