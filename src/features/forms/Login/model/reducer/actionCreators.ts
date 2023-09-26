import { createAsyncThunk } from '@reduxjs/toolkit';
import { type IUser, userActionCreators } from 'store/User';
import { USER_LOCALSTORAGE_KEY } from 'shared/const';
import { type IThunkConfig } from 'config/store';
import { appActionCreators } from 'store/app';



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
        try {
            const { password, username  } = getState()?.forms?.login || {};

            const { data } = await api.post<IUser>('/login', { password, username });

            if (!data) {
                throw new Error();
            }

            dispatch(userActionCreators.setAuthData(data));
            dispatch(appActionCreators.setIsAuthenticated(true, true));
            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(data));

            return fulfillWithValue(data);
        } catch (e) {
            console.log('__CUSTOM__', e);
            return rejectWithValue('error');
        }
    },
);
