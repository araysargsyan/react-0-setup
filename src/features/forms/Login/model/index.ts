export { default, loginActions } from './reducer/slice';
export * from './selectors';

export interface ILoginSchema {
    username: string;
    password: string;
    isLoading: boolean;
    error?: string;
}
