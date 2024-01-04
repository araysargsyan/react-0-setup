import { type ReducersMapObject } from '@reduxjs/toolkit';
import { type IAppSchema } from 'config/store';
import UI, { type IUISchema } from 'store/UI';

import { type IArticlesSchema } from './Articles';
import { type IProfileSchema } from './Profile';
import counter, { type ICounterSchema } from './Counter';
import user, { type IUserSchema } from './User';
import app from './app';


export interface IInitialStateSchema {
    app: IAppSchema;
    user: IUserSchema;
    UI: IUISchema;
    profile?: IProfileSchema;
    articles?: IArticlesSchema;

    counter: ICounterSchema;
}

export const initialReducers: ReducersMapObject<IInitialStateSchema> = {
    [app.name]: app.reducer,
    [user.name]: user.reducer,
    [UI.name]: UI.reducer,

    [counter.name]: counter.reducer,
};
