export { default, loginActionCreators } from './reducer/slice';
export * from './selectors';

export interface ILoginSchema {
    username: string;
    password: string;
    isLoading: boolean;
    error?: string;
}
