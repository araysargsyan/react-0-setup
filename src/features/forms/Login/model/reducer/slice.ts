import  { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import  { type ILoginSchema } from '..';
import { login } from './actionCreators';


const initialState: ILoginSchema = {
    isLoading: false,
    username: '',
    password: ''
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUsername(state, { payload }: PayloadAction<ILoginSchema['username']>) {
            state.username = payload;
        },
        setPassword(state, { payload }: PayloadAction<ILoginSchema['password']>) {
            state.password = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload;
            });
    },
});

export const loginActionCreators = {
    ...loginSlice.actions,
    login
};
export default {
    name: loginSlice.name,
    reducer: loginSlice.reducer
};
