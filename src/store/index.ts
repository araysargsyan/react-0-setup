import { ReducersMapObject } from '@reduxjs/toolkit';
import login, { loginActions, ILoginSchema } from 'features/AuthByUsername/model';

import counter, { counterActions, ICounterSchema } from './Counter';
import user, { userActions, IUserSchema } from './User';


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
