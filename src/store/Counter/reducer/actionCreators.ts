import { createAsyncThunk } from '@reduxjs/toolkit';
import { type IThunkConfig } from 'config/store';
import until from 'app/dubag/util/wait';


export const fetchTest = createAsyncThunk<
    void,
    undefined,
    IThunkConfig<string>
>('fetchTest', async (_, {
    fulfillWithValue,
    extra: { api }
}) => {
    await until(600);
    const { data } = await api.get('/test');

    return fulfillWithValue(data);
});
