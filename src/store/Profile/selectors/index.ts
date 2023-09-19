import { type IStateSchema } from 'config/store';
import { createSelector } from '@reduxjs/toolkit';


export const getProfileData = (state: IStateSchema) => state.profile?.data;
export const getProfileReadonly = (state: IStateSchema) => state.profile?.readonly;
export const getProfileError = (state: IStateSchema) => state.profile?.error;
export const isProfileLoading = (state: IStateSchema) => Boolean(state.profile?.isLoading) && !Boolean(state.profile?.data);

export const getProfileIsLoading = createSelector(
    isProfileLoading,
    getProfileData,
    (isLoading, isFetched) => isLoading || !isFetched
);


