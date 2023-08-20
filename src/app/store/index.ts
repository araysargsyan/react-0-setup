import { ReducersMapObject } from '@reduxjs/toolkit';

import counter, { counterActions, ICounterSchema } from './Counter';


export interface IStateSchema {
    counter: ICounterSchema;
}

export const initialReducers: ReducersMapObject<IStateSchema> = {
    [counter.name]: counter.reducer,
};

export const actionCreators = {
    ...counterActions
};
