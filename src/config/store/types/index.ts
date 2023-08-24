import { type EnhancedStore, type ReducersMapObject } from '@reduxjs/toolkit';
import { type IAsyncStateSchema, type IInitialStateSchema } from 'store';
import { type IFormStateSchema } from 'features';

import { type IReducerManager } from '../lib';
import { type TCreateStore } from '../store';


interface IDefaultStateSchema extends IInitialStateSchema, IAsyncStateSchema {
}

export interface INestedStateSchema<M = false> {
    forms?: M extends true ? ReducersMapObject<IFormStateSchema> : IFormStateSchema;
}

export interface IStateSchema extends IDefaultStateSchema, INestedStateSchema {}

export type TStore = ReturnType<TCreateStore>;
export type TAppDispatch = TStore['dispatch'];
export interface IReduxStoreWithManager extends EnhancedStore<IStateSchema> {
    reducerManager: IReducerManager;
}
