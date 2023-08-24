import  { type DeepPartial } from '@reduxjs/toolkit';
import  { type IInitialStateSchema } from 'store';
import { type IStateSchema } from 'config/store';

import { getCounter, getCounterValue } from '..';


describe('getCounter', () => {
    test('should return counter value', () => {
        const state: DeepPartial<IStateSchema> = { counter: { value: 10 }, };
        expect(getCounter(state as IInitialStateSchema)).toEqual({ value: 10 });
    });
});

describe('getCounterValue', () => {
    test('', () => {
        const state: DeepPartial<IStateSchema> = { counter: { value: 10 }, };
        expect(getCounterValue(state as IInitialStateSchema)).toEqual(10);
    });
});
