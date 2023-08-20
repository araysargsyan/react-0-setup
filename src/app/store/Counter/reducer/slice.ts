import { createSlice } from '@reduxjs/toolkit';

import { ICounterSchema } from '..';


const initialState: ICounterSchema = {
    value: 0,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
    },
});

export const counterActions = {
    ...counterSlice.actions
};
export default {
    name: counterSlice.name,
    reducer: counterSlice.reducer
} = counterSlice;
