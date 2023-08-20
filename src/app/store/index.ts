import counter, { counterActions, ICounterSchema } from './Counter';


export interface IStateSchema {
    counter: ICounterSchema;
}

export const initialReducers = {
    [counter.name]: counter.reducer,
};

export const actionCreators = {
    ...counterActions
};
