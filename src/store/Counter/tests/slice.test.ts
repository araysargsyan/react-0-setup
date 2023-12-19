import counterSlice, { type ICounterSchema, counterActionCreators } from '..';


const counterReducer = counterSlice.reducer;

describe('counterSlice', () => {
    test('decrement', () => {
        const state: ICounterSchema = { value: 10 };

        expect(
            counterReducer(state, counterActionCreators.decrement()),
        ).toEqual({ value: 9 });
    });
    test('increment', () => {
        const state: ICounterSchema = { value: 10 };

        expect(
            counterReducer(state, counterActionCreators.increment()),
        ).toEqual({ value: 11 });
    });

    test('should work with empty state', () => {
        expect(
            counterReducer(undefined, counterActionCreators.increment()),
        ).toEqual({ value: 1 });
    });
});
