import { type IStateSchema } from 'config/store';

import {
    getLoginError,
    getLoginIsLoading,
    getLoginPassword,
    getLoginUsername
} from '../selectors';


describe('getLoginError.test', () => {
    test('should return error', () => {
        const state: DeepPartial<IStateSchema> = { forms: { login: { error: 'error' } }, };
        expect(getLoginError(state as IStateSchema)).toEqual('error');
    });
    test('should work with empty state', () => {
        const state: DeepPartial<IStateSchema> = {};
        expect(getLoginError(state as IStateSchema)).toEqual(undefined);
    });
});

describe('getLoginIsLoading.test', () => {
    test('should return true', () => {
        const state: DeepPartial<IStateSchema> = { forms: { login: { isLoading: true } }, };
        expect(getLoginIsLoading(state as IStateSchema)).toEqual(true);
    });
    test('should work with empty state', () => {
        const state: DeepPartial<IStateSchema> = {};
        expect(getLoginIsLoading(state as IStateSchema)).toEqual(false);
    });
});

describe('getLoginPassword.test', () => {
    test('should return value', () => {
        const state: DeepPartial<IStateSchema> = { forms: { login: { password: '123123', } }, };
        expect(getLoginPassword(state as IStateSchema)).toEqual('123123');
    });
    test('should work with empty state', () => {
        const state: DeepPartial<IStateSchema> = {};
        expect(getLoginPassword(state as IStateSchema)).toEqual('');
    });
});

describe('getLoginUsername.test', () => {
    test('should return value', () => {
        const state: DeepPartial<IStateSchema> = { forms: { login: { username: '123123', } }, };
        expect(getLoginUsername(state as IStateSchema)).toEqual('123123');
    });
    test('should work with empty state', () => {
        const state: DeepPartial<IStateSchema> = {};
        expect(getLoginUsername(state as IStateSchema)).toEqual('');
    });
});
