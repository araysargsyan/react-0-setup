import  { type ReducersMapObject } from '@reduxjs/toolkit';
import login, { type ILoginSchema, loginActions } from 'features/AuthByUsername/model';

import counter, { type ICounterSchema, counterActions } from './Counter';
import user, { type IUserSchema, userActions } from './User';


export interface IStateSchema {
    counter: ICounterSchema;
    user: IUserSchema;

    login?: ILoginSchema;
}

export const initialReducers: ReducersMapObject<IStateSchema> = {
    [counter.name]: counter.reducer,
    [user.name]: user.reducer,
    [login.name]: login.reducer,
};

export const actionCreators = {
    ...counterActions,
    ...userActions,

    ...loginActions
};
