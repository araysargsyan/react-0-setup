export { default, counterActions } from './reducer/slice';
export * from './selectors';

export interface ICounterSchema {
    value: number;
}
