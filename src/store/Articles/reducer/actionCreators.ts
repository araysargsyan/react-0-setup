import { createAsyncThunk } from '@reduxjs/toolkit';
import { type IThunkConfig } from 'config/store';
import until from 'app/dubag/util/wait';

import {
    articlesActionCreators,
    ArticlesType,
    getArticlesHasMore,
    getArticlesInited,
    getArticlesIsLoading,
    getArticlesLimit,
    getArticlesNum,
    getArticlesOrder,
    getArticlesSearch,
    getArticlesSort,
    getArticlesType,
    type IArticles, type TArticlesSortField, type TArticlesType, type TSortOrder
} from '../';




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

const init = createAsyncThunk<
    void,
    URLSearchParams,
    IThunkConfig<string>
>(
    'articles/init',
    async (searchParams, thunkApi) => {
        const { getState, dispatch } = thunkApi;
        const inited = getArticlesInited(getState());

        if (!inited) {
            const orderFromUrl = searchParams.get('order') as TSortOrder;
            const sortFromUrl = searchParams.get('sort') as TArticlesSortField;
            const searchFromUrl = searchParams.get('search');
            const typeFromUrl = searchParams.get('type') as TArticlesType;

            if (orderFromUrl) {
                dispatch(articlesActionCreators.setOrder(orderFromUrl));
            }
            if (sortFromUrl) {
                dispatch(articlesActionCreators.setSort(sortFromUrl));
            }
            if (searchFromUrl) {
                dispatch(articlesActionCreators.setSearch(searchFromUrl));
            }
            if (typeFromUrl) {
                dispatch(articlesActionCreators.setType(typeFromUrl));
            }

            dispatch(articlesActionCreators.initState());
            dispatch(articlesActionCreators.fetchAll());
        }
    },
);

const fetchNext = createAsyncThunk<
    void,
    void,
    IThunkConfig<string>
>(
    'articles/fetchNext',
    async (_, thunkApi) => {
        const { getState, dispatch } = thunkApi;
        const hasMore = getArticlesHasMore(getState());
        const page = getArticlesNum(getState());
        const isLoading = getArticlesIsLoading(getState());

        if (hasMore && !isLoading) {
            dispatch(articlesActionCreators.setPage(page + 1));
            dispatch(articlesActionCreators.fetchAll());
        }
    },
);

export {
    fetchById, fetchAll, init, fetchNext
};
