import { type ReducersMapObject } from '@reduxjs/toolkit';

import { type IProfileSchema } from './Profile';
import { type ICounterSchema } from './Counter';
import user, { type IUserSchema, userActions } from './User';
import app, { type IAppSchema, appActions } from './App';


export interface IInitialStateSchema {
    app: IAppSchema;
    user: IUserSchema;
    counter?: ICounterSchema;
    profile?: IProfileSchema;
}

export const initialReducers: ReducersMapObject<IInitialStateSchema> = {
    [app.name]: app.reducer,
    [user.name]: user.reducer,
};

export const actionCreators = {
    ...appActions,
    ...userActions,
    // ...counterActions,
    // ...profileActions,
};
