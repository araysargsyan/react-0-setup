import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { type IUser, userActions } from 'store/User';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { type IStateSchema } from 'config/store';


export const login = createAsyncThunk<
    IUser,
    never,
    { state: IStateSchema; rejectValue: string }
>(
    'login/submit',
    async (_,
        {
            getState,
            dispatch,
            rejectWithValue,
            fulfillWithValue
        }) => {
        try {
            const { password, username } = getState().forms.login;

            const { data } = await axios.post<IUser>('http://localhost:8000/login', { password, username });

            if (!data) {
                throw new Error();
            }

            dispatch(userActions.setAuthData(data));
            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(data));

            return fulfillWithValue(data);
        } catch (e) {
            console.log('__CUSTOM__', e);
            return rejectWithValue('error');
        }
    },
);
