import { createAsyncThunk } from '@reduxjs/toolkit';
import { type IUser, userActions } from 'store/User';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { type IThunkConfig } from 'config/store';



export const login = createAsyncThunk<
    IUser,
    undefined,
    IThunkConfig<string>
>(
    'login/submit',
    async (_,
        {
            getState,
            dispatch,
            rejectWithValue,
            fulfillWithValue,
            extra: { api }
        }
    ) => {
        console.log(_, 99999999999);
        try {
            const { password, username  } = getState()?.forms?.login || {};

            const { data } = await api.post<IUser>('/login', { password, username });

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
