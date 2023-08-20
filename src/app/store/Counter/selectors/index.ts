import { createSelector } from '@reduxjs/toolkit';
import { IStateSchema } from 'app/store';

import { ICounterSchema } from '..';


export const getCounter = (state: IStateSchema) => state.counter;
export const getCounterValue = createSelector(
    getCounter,
    (counter: ICounterSchema) => counter.value,
);
