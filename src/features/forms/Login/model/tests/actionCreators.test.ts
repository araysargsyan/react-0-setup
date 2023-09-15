import { userActionCreators } from 'store/User';
import { TestAsyncThunk } from '@config/jest/lib/TestAsyncThunk';
import { loginActions } from 'features/forms/Login/model';


jest.mock('store/app');
describe('login.test', () => {

    test('success login', async () => {
        const userValue = { username: '123', id: '1' };
        const thunk = new TestAsyncThunk(
            loginActions.login,
            { forms: { login: { username: '123', password: '123' } } }
        );
        thunk.api.post.mockReturnValue(Promise.resolve({ data: userValue }));
        const result = await thunk.callThunk();

        expect(thunk.dispatch).toHaveBeenCalledWith(userActionCreators.setAuthData(userValue));
        expect(thunk.dispatch).toHaveBeenCalledTimes(4);
        expect(thunk.api.post).toHaveBeenCalled();
        expect(result.meta.requestStatus).toBe('fulfilled');
        expect(result.payload).toEqual(userValue);
    });

    test('error login', async () => {
        const thunk = new TestAsyncThunk(loginActions.login,
            { forms: { login: { username: '123', password: '123' } } });
        thunk.api.post.mockReturnValue(Promise.resolve({ status: 403 }));
        const result = await thunk.callThunk();

        expect(thunk.dispatch).toHaveBeenCalledTimes(2);
        expect(thunk.api.post).toHaveBeenCalled();
        expect(result.meta.requestStatus).toBe('rejected');
        expect(result.payload).toBe('error');
    });
});
