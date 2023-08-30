import { type IStateSchema } from 'config/store';
import { createSelector } from '@reduxjs/toolkit';
import { getProfileData, type IProfile } from 'store/Profile';


const getEditProfile = (state: IStateSchema) => state?.forms?.editProfile;
export const getEditProfileData =  createSelector(
    getProfileData,
    getEditProfile,
    (profileData, editProfileData) => {
        return  editProfileData ? editProfileData : profileData;
    }
);

export const getEditProfileField = (key: keyof IProfile) => createSelector(
    getEditProfileData,
    (data) => data ? data![key] : undefined
);
