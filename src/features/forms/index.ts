import { type ReducersMapObject } from '@reduxjs/toolkit';

import login, { type ILoginSchema, loginActions } from './Login/model';


export interface IFormStateSchema {
    login: ILoginSchema;
}

export const formReducers: ReducersMapObject<IFormStateSchema> = { [login.name]: login.reducer, };

export const formActionCreators = { ...loginActions, };
