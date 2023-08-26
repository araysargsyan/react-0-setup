import { type EnhancedStore } from '@reduxjs/toolkit';
import { type IInitialStateSchema } from 'store';
import { type IFormStateSchema } from 'features/forms';

import { type IReducerManager } from '../lib/ReducerManager';
import { type TCreateStore } from '../store';


export interface INestedStateSchema {
    forms?: IFormStateSchema;
}

export interface IStateSchema extends IInitialStateSchema, INestedStateSchema {}
export type TStateWithoutNestedSchema = Omit<IStateSchema, keyof INestedStateSchema>;


export type TStore = ReturnType<TCreateStore>;
export type TAppDispatch = TStore['dispatch'];
export interface IReduxStoreWithManager extends EnhancedStore<IStateSchema> {
    reducerManager: IReducerManager<TStateWithoutNestedSchema, INestedStateSchema>;
}
