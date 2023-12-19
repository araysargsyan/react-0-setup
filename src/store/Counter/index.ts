export { default, counterActionCreators } from './reducer/slice';
export * from './selectors';

export interface ICounterSchema {
    value: number;
    testData?: any;
}
