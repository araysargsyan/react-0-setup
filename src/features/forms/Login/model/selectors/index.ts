import { type IStateSchema } from 'config/store';


export const getLoginError = (state: IStateSchema) => state?.forms?.login?.error;
export const getLoginIsLoading = (state: IStateSchema) => state?.forms?.login?.isLoading || false;
export const getLoginPassword = (state: IStateSchema) => state?.forms?.login?.password || '';
export const getLoginUsername = (state: IStateSchema) => state?.forms?.login?.username || '';

