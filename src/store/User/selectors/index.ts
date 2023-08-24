import  { type IInitialStateSchema } from 'store';


export const getUserAuthData = ({ user }: IInitialStateSchema) => user.authData;
