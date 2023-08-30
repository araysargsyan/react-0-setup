import { type IStateSchema } from 'config/store';


export const getProfileData = (state: IStateSchema) => state.profile?.data;
export const getProfileReadonly = (state: IStateSchema) => state.profile?.readonly;
export const getProfileError = (state: IStateSchema) => state.profile?.error;
export const getProfileIsLoading = (state: IStateSchema) => state.profile?.isLoading;

export const isProfileFetched = (state: IStateSchema) => !!state.profile?.data;


