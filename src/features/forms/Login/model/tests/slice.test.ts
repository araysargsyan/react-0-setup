import { type DeepPartial } from '@reduxjs/toolkit';

import login, { type ILoginSchema, loginActionCreators } from '..';


jest.mock('store/app');
describe('loginSlice.test', () => {
    test('test set username', () => {
        const state: DeepPartial<ILoginSchema> = { username: '123' };
        expect(login.reducer(
            state as ILoginSchema,
            loginActionCreators.setUsername('123123'),
        )).toEqual({ username: '123123' });
    });

    test('test set password', () => {
        const state: DeepPartial<ILoginSchema> = { password: '123' };
        expect(login.reducer(
            state as ILoginSchema,
            loginActionCreators.setPassword('123123'),
        )).toEqual({ password: '123123' });
    });
});
