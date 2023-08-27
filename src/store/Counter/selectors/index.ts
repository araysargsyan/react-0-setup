import { createSelector } from '@reduxjs/toolkit';
import { type IStateSchema } from 'config/store';

import  { type ICounterSchema } from '..';


export const getCounter = (state: IStateSchema) => state.counter;
export const getCounterValue = createSelector(
    getCounter,
    (counter?: ICounterSchema) => counter?.value,
);
