import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type IProfileSchema } from 'store/Profile';

import { fetchData, updateData } from './actionCreators';


const initialState: IProfileSchema = {
    readonly: true,
    isLoading: false,
    error: undefined,
    data: undefined,
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setReadonly: (state, action: PayloadAction<boolean>) => {
            state.readonly = action.payload;
        },
        cancelEdit: (state) => {
            state.readonly = true;
            //state.validateErrors = undefined;
            //state.form = state.data;
        },
    },
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
            })

            .addCase(updateData.pending, (state) => {
                // state.validateErrors = undefined;
                state.isLoading = true;
            })
            .addCase(updateData.fulfilled, (
                state,
                action,
            ) => {
                state.isLoading = false;
                state.data = action.payload;
                //state.form = action.payload;
                state.readonly = true;
                //state.validateErrors = undefined;
            })
            .addCase(updateData.rejected, (state) => {
                state.isLoading = false;
                //state.validateErrors = action.payload;
            });
    },
});


export const profileActions = {
    ...profileSlice.actions, fetchData, updateData 
};

export type TProfileActions = typeof profileActions;
export default {
    name: profileSlice.name,
    reducer: profileSlice.reducer
};
