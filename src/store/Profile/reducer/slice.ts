import { createSlice } from '@reduxjs/toolkit';
import { type IProfileSchema } from 'store/Profile';


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
});


export const profileActions = { ...profileSlice.actions };
export default {
    name: profileSlice.name,
    reducer: profileSlice.reducer
};
