import { type IStateSchema } from 'config/store';


export const getProfileData = (state: IStateSchema) => state.profile?.data;
export const getProfileError = (state: IStateSchema) => state.profile?.error;
export const getProfileIsLoading = (state: IStateSchema) => state.profile?.isLoading;


