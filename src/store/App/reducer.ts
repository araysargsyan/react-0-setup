import { createReducer } from '@reduxjs/toolkit';
import { type IAppSchema } from 'store/App/index';
import { setIsReducersInitiated } from 'store/App/actions';


const appReducerName = 'app' as const;
const app = createReducer<IAppSchema>({ isReducersInitiated: false }, (builder) => {
    builder
        .addCase(setIsReducersInitiated, (state, { payload }) => {
            state.isReducersInitiated = payload;
        });
});

export default {
    name: appReducerName,
    reducer: app,
};
