import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type IEditProfileSchema } from '..';


const initialState: IEditProfileSchema = {};

export const editProfileSlice = createSlice({
    name: 'editProfile',
    initialState,
    reducers: {
        setFirstname(state, { payload }: PayloadAction<IEditProfileSchema['firstname']>) {
            state.firstname = payload;
        },
        setLastname(state, { payload }: PayloadAction<IEditProfileSchema['lastname']>) {
            state.lastname = payload;
        },
        setAge(state, { payload }: PayloadAction<IEditProfileSchema['age']>) {
            state.age = payload;
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(login.pending, (state) => {
    //             state.error = undefined;
    //             state.isLoading = true;
    //         })
    //         .addCase(login.fulfilled, (state) => {
    //             state.isLoading = false;
    //         })
    //         .addCase(login.rejected, (state, { payload }) => {
    //             state.isLoading = false;
    //             state.error = payload;
    //         });
    // },
});
export const editProfileActions = { ...editProfileSlice.actions, };

export default {
    name: editProfileSlice.name,
    reducer: editProfileSlice.reducer
};
