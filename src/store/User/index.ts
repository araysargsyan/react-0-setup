export { default, userActionCreators } from './reducer/slice';
export * from './selectors';

export interface IUser {
    id: string;
    username: string;
}

export interface IUserSchema {
    authData?: IUser;
}
