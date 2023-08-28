import { createSlice } from '@reduxjs/toolkit';
import { type IProfileSchema } from 'store/Profile';
import fetchData from 'store/Profile/reducer/actionCreators';


const initialState: IProfileSchema = {
    readonly: true,
    isLoading: false,
    error: undefined,
    data: undefined,
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchData.fulfilled, (
                state,
                { payload },
            ) => {
                state.isLoading = false;
                state.data = payload;
            })
            .addCase(fetchData.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload;
            });
    },
});


export const profileActions = { ...profileSlice.actions, fetchData };
export default {
    name: profileSlice.name,
    reducer: profileSlice.reducer
};
