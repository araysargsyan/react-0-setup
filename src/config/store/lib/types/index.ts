import {
    type AnyAction,
    type CombinedState,
    type Reducer,
    type ReducersMapObject
} from '@reduxjs/toolkit';
import { type IStateSchema } from 'config/store';
import { type IFormStateSchema } from 'features';


export type TAsyncStateKeys = keyof Omit<IStateSchema, 'forms'>;
export type TFormsStateKeys = keyof IFormStateSchema;
export interface IAddReducersOptions {
    key: TAsyncStateKeys | TFormsStateKeys;
    parentKey?: 'forms';
    reducer: Reducer;
}
export interface IRemoveReducersOptions {
    key: TAsyncStateKeys | TFormsStateKeys;
    parentKey?: 'forms';
}

export interface INestedReducers {
    forms?: Record<TFormsStateKeys, Reducer>;
}
export interface IReducerManager {
    getReducerMap: () => ReducersMapObject<IStateSchema>;
    reduce: (state: IStateSchema, action: AnyAction) => CombinedState<IStateSchema>;
    add: (options: IAddReducersOptions | IAddReducersOptions[]) => void;
    remove: (options: IRemoveReducersOptions | IRemoveReducersOptions[]) => void;
}
