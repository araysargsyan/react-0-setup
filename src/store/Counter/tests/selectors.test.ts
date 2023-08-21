import { DeepPartial } from '@reduxjs/toolkit';
import { IStateSchema } from 'store';

import { getCounter, getCounterValue } from '..';


describe('getCounter', () => {
    test('should return counter value', () => {
        const state: DeepPartial<IStateSchema> = {
            counter: { value: 10 },
        };
        expect(getCounter(state as IStateSchema)).toEqual({ value: 10 });
    });
});

describe('getCounterValue', () => {
    test('', () => {
        const state: DeepPartial<IStateSchema> = {
            counter: { value: 10 },
        };
        expect(getCounterValue(state as IStateSchema)).toEqual(10);
    });
});
