import  { type IStateSchema } from 'store';


export const getUserAuthData = ({ user }: IStateSchema) => user.authData;
