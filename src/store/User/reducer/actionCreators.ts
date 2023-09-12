import { createAsyncThunk } from '@reduxjs/toolkit';
import { type IThunkConfig } from 'config/store';
import { userActionCreators } from 'store/User';
import { appActionCreators } from 'store/app';


export const logout = createAsyncThunk<
    void,
    undefined,
    IThunkConfig<string>
>('logout/submit', async (_, { dispatch }) => {
    dispatch(userActionCreators.clearAuthData());
    dispatch(appActionCreators.setIsAuthenticated(false));
});
