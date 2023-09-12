import  { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { logout } from 'store/User/reducer/actionCreators';

import  { type IUser, type IUserSchema } from '..';


const initialState: IUserSchema = {};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<IUser>) => {
            state.authData = action.payload;
        },
        initAuthData: (state) => {
            const user = localStorage.getItem(USER_LOCALSTORAGE_KEY);
            if (user) {
                state.authData = JSON.parse(user);
            }
        },
        clearAuthData: (state) => {
            state.authData = undefined;
            localStorage.removeItem(USER_LOCALSTORAGE_KEY);
        },
    },
});

export const userActionCreators = {
    ...userSlice.actions,
    logout
};
export default {
    name: userSlice.name,
    reducer: userSlice.reducer
};
