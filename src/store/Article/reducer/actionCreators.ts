import { createAsyncThunk } from '@reduxjs/toolkit';
import { type IThunkConfig } from 'config/store';
import until from 'app/dubag/util/wait';

import { type IArticle } from '..';


const fetchById = createAsyncThunk<
    IArticle,
    string,
    IThunkConfig<string>
>(
    'articleDetails/fetchById',
    async (articleId, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<IArticle>(`/articles/${articleId}`);
            await until(600);

            if (!response.data) {
                throw new Error();
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('error');
        }
    },
);

export { fetchById };
