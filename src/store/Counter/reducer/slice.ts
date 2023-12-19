import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchTest } from 'store/Counter/reducer/actionCreators';


interface ICounterSchema {
    value: number;
    testData?: any;
}
const initialState: ICounterSchema = { value: 0 };

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, { payload }: PayloadAction<number | undefined>) => {
            if (payload) {
                state.value = state.value + payload;
            } else {
                state.value += 1;
            }
        },
        decrement: (state) => {
            state.value -= 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTest.fulfilled, (state, { payload }) => {
                state.testData = payload;
            });
    },
});

const counterActionCreators = { ...counterSlice.actions, fetchTest };

export { counterActionCreators, type ICounterSchema };
export default {
    name: counterSlice.name,
    reducer: counterSlice.reducer
};
