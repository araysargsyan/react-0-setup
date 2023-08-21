import  { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import  { type ILoginSchema } from '..';
import { loginByUsername } from './actionCreators';


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
            .addCase(loginByUsername.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(loginByUsername.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(loginByUsername.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const loginActions = {
    ...loginSlice.actions,
    loginByUsername
};
export default {
    name: loginSlice.name,
    reducer: loginSlice.reducer
};
