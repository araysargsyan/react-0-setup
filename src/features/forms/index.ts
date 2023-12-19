import { type ReducersMapObject } from '@reduxjs/toolkit';

import login, { loginActionCreators, type ILoginSchema } from './Login/model';
import editProfile, { editProfileActionCreators, type IEditProfileSchema } from './EditProfile/model';


export interface IFormStateSchema {
    [login.name]: ILoginSchema;
    [editProfile.name]: IEditProfileSchema;
}

export const formReducers: ReducersMapObject<IFormStateSchema> = {
    [login.name]: login.reducer,
    [editProfile.name]: editProfile.reducer,
};

export const formActionCreators = { ...loginActionCreators, ...editProfileActionCreators };
