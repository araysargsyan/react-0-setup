import { type AsyncThunkAction } from '@reduxjs/toolkit';
import { type IStateSchema } from 'config/store';
import axios, { type AxiosStatic } from 'axios';


type ActionCreatorType<Return, Arg, RejectedValue>
    = (arg?: Arg) => AsyncThunkAction<Return, Arg, { rejectValue: RejectedValue }>;

jest.mock('axios');
const mockedAxios = jest.mocked(axios);
export class TestAsyncThunk<Return, Arg, RejectedValue> {
    dispatch: jest.MockedFn<any>;

    getState: () => DeepPartial<IStateSchema> | undefined;

    actionCreator: ActionCreatorType<Return, Arg, RejectedValue>;

    api: jest.MockedFunctionDeep<AxiosStatic>;

    constructor(actionCreator: ActionCreatorType<Return, Arg, RejectedValue>, state?: DeepPartial<IStateSchema>) {
        this.actionCreator = actionCreator;
        this.dispatch = jest.fn();
        this.getState = jest.fn(() => state);

        this.api = mockedAxios;
    }

    async callThunk(arg?: Arg) {
        const action = this.actionCreator(arg);
        const result = await action(
            this.dispatch,
            this.getState,
            { api: this.api },
        );

        return result;
    }
}
