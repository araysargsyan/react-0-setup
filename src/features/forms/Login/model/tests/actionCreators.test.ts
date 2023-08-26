import axios from 'axios';
import { userActions } from 'store/User';
import { TestAsyncThunk } from '@config/jest/ui/TestAsyncThunk';
import { loginActions } from 'features/forms/Login/model';


jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('login.test', () => {
    test('success login', async () => {
        const userValue = { username: '123', id: '1' };
        mockedAxios.post.mockReturnValue(Promise.resolve({ data: userValue }));

        const thunk = new TestAsyncThunk(
            loginActions.login,
            { forms: { login: { username: '123', password: '123' } } }
        );
        const result = await thunk.callThunk();

        expect(thunk.dispatch).toHaveBeenCalledWith(userActions.setAuthData(userValue));
        expect(thunk.dispatch).toHaveBeenCalledTimes(3);
        expect(mockedAxios.post).toHaveBeenCalled();
        expect(result.meta.requestStatus).toBe('fulfilled');
        expect(result.payload).toEqual(userValue);
    });

    test('error login', async () => {
        mockedAxios.post.mockReturnValue(Promise.resolve({ status: 403 }));

        const thunk = new TestAsyncThunk(loginActions.login,
            { forms: { login: { username: '123', password: '123' } } });
        const result = await thunk.callThunk();

        expect(thunk.dispatch).toHaveBeenCalledTimes(2);
        expect(mockedAxios.post).toHaveBeenCalled();
        expect(result.meta.requestStatus).toBe('rejected');
        expect(result.payload).toBe('error');
    });
});
