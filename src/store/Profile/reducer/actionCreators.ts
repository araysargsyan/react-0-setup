import { createAsyncThunk } from '@reduxjs/toolkit';
import { type IProfile } from 'store/Profile';
import { type IThunkConfig } from 'config/store';
import until from 'app/dubag/util/wait';



const fetchData = createAsyncThunk<
    IProfile,
    undefined,
    IThunkConfig<string>
>(
    'profile/fetchData',
    async (_, {
        extra: { api }, rejectWithValue, fulfillWithValue 
    }) => {
        try {
            // await until(1000);
            const { data } = await api.get<IProfile>('/profile');

            if (!data) {
                throw new Error();
            }

            return fulfillWithValue(data);
        } catch (e) {
            console.log('__CUSTOM__', e);
            return rejectWithValue('error');
        }
    },
);

const updateData = createAsyncThunk<
    IProfile,
    void,
    IThunkConfig<string>
>(
    'profile/updateProfileData',
    async (_, {
        extra: { api }, rejectWithValue, getState
    }) => {
        const formData = getState().forms?.editProfile;

        // const errors = validateProfileData(formData);
        //
        // if (errors.length) {
        //     return rejectWithValue(errors);
        // }

        try {
            const response = await api.put<IProfile>('/profile', formData);

            if (!response.data) {
                throw new Error();
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('error');
        }
    },
);

export {
    fetchData,
    updateData
};
