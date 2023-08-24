import login, { type ILoginSchema, loginActions } from 'features/AuthByUsername/model';
import { type ReducersMapObject } from '@reduxjs/toolkit';


export interface IFormStateSchema {
    login?: ILoginSchema;
}

export const formReducers: ReducersMapObject<IFormStateSchema> = { [login.name]: login.reducer, };

export const formActionCreators = { ...loginActions, };
