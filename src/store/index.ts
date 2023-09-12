import { type ReducersMapObject } from '@reduxjs/toolkit';
import { type IAppSchema } from 'config/store';

import { type IProfileSchema } from './Profile';
import counter, { counterActions, type ICounterSchema } from './Counter';
import user, { type IUserSchema, userActionCreators } from './User';
import app from './app';


export interface IInitialStateSchema {
    app: IAppSchema;
    user: IUserSchema;
    profile?: IProfileSchema;

    counter: ICounterSchema;
}

export const initialReducers: ReducersMapObject<IInitialStateSchema> = {
    [app.name]: app.reducer,
    [user.name]: user.reducer,

    [counter.name]: counter.reducer,
};

export const actionCreators = {
    ...userActionCreators,
    ...counterActions,
    // ...profileActions,
};
