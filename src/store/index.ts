import { type ReducersMapObject } from '@reduxjs/toolkit';

import { type IProfileSchema, profileActions } from './Profile';
import { type ICounterSchema, counterActions } from './Counter';
import user, { type IUserSchema, userActions } from './User';


export interface IInitialStateSchema {
    user: IUserSchema;
    counter?: ICounterSchema;
    profile?: IProfileSchema;
}

export const initialReducers: ReducersMapObject<IInitialStateSchema> = { [user.name]: user.reducer, };

export const actionCreators = {
    ...counterActions,
    ...userActions,
    ...profileActions,
};
