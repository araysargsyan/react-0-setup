import { createAsyncThunk } from '@reduxjs/toolkit';
import { type IProfile } from 'store/Profile';
import { type IThunkConfig } from 'config/store';



const fetchData = createAsyncThunk<
    IProfile,
    undefined,
    IThunkConfig<string>
>(
    'profile/fetchProfileData',
    async (_, {
        extra: { api }, rejectWithValue, fulfillWithValue 
    }) => {
        try {
            const response = await api.get<IProfile>('/profile');

            return fulfillWithValue(response.data);
        } catch (e) {
            console.log('__CUSTOM__', e);
            return rejectWithValue('error');
        }
    },
);

export default fetchData;
