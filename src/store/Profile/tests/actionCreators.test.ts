import { TestAsyncThunk } from '@config/jest/lib/TestAsyncThunk';
import { ECountry } from 'features/Country/model';
import { Currency } from 'features/Currency';

import { fetchData } from '../reducer/actionCreators';


const data = {
    username: 'admin',
    age: 22,
    country: ECountry.Ukraine,
    lastname: 'ulbi tv',
    first: 'asd',
    city: 'asf',
    currency: Currency.USD,
};

describe('fetchData.test', () => {
    test('success', async () => {
        const thunk = new TestAsyncThunk(fetchData);
        thunk.api.get.mockReturnValue(Promise.resolve({ data }));

        const result = await thunk.callThunk();

        expect(thunk.api.get).toHaveBeenCalled();
        expect(result.meta.requestStatus).toBe('fulfilled');
        expect(result.payload).toEqual(data);
    });

    test('error login', async () => {
        const thunk = new TestAsyncThunk(fetchData);
        thunk.api.get.mockReturnValue(Promise.resolve({ status: 403 }));
        const result = await thunk.callThunk();

        expect(result.meta.requestStatus).toBe('rejected');
    });
});
