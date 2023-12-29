import { createAsyncThunk } from '@reduxjs/toolkit';
import { type IThunkConfig } from 'config/store';
import until from 'app/dubag/util/wait';

import {
    ArticlesType,
    getArticlesLimit,
    getArticlesNum,
    getArticlesOrder,
    getArticlesSearch,
    getArticlesSort,
    getArticlesType,
    type IArticles
} from '../index';


interface IFetchArticlesListProps {
    replace?: boolean;
}

const fetchAll = createAsyncThunk<
    IArticles[],
    IFetchArticlesListProps | undefined,
    IThunkConfig<string>
>(
    'articles/fetchAll',
    async (props, thunkApi) => {
        const {
            extra, rejectWithValue, getState
        } = thunkApi;
        const limit = getArticlesLimit(getState());
        const sort = getArticlesSort(getState());
        const order = getArticlesOrder(getState());
        const search = getArticlesSearch(getState());
        const page = getArticlesNum(getState());
        const type = getArticlesType(getState());

        try {
            // addQueryParams({
            //     sort, order, search, type,
            // });
            const response = await extra.api.get<IArticles[]>('/articles', {
                params: {
                    _expand: 'user',
                    _limit: limit,
                    _page: page,
                    _sort: sort,
                    _order: order,
                    q: search,
                    type: type === ArticlesType.ALL ? undefined : type,
                },
            });

            if (!response.data) {
                throw new Error();
            }

            return response.data;
        } catch (e) {
            return rejectWithValue('error');
        }
    },
);

const fetchById = createAsyncThunk<
    IArticles,
    string,
    IThunkConfig<string>
>(
    'articles/fetchById',
    async (articleId, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<IArticles>(`/articles/${articleId}`);
            // await until(600);

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

export { fetchById, fetchAll };
