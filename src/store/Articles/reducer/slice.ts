import {
    createEntityAdapter, createSlice, type PayloadAction
} from '@reduxjs/toolkit';
import { type IStateSchema } from 'config/store';

import {
    ArticlesSortField,
    ArticlesType,
    type TArticlesSortField,
    type IArticles,
    type IArticlesSchema,
    type TSortOrder,
    type TArticlesType
} from '../index';
import { fetchAll, fetchById } from './actionCreators';


const articlesAdapter = createEntityAdapter<IArticles>({ selectId: (article) => article.id });
const articlesSelector = articlesAdapter.getSelectors<IStateSchema>(
    (state) => state.articles || articlesAdapter.getInitialState(),
);
const initialState = articlesAdapter.getInitialState<IArticlesSchema>({
    isLoading: false,
    error: undefined,
    ids: [],
    entities: {},
    page: 1,
    hasMore: true,
    limit: 9,
    // sort: ArticleSortField.CREATED,
    sort: 'createdAt',
    search: '',
    order: 'asc',
    // type: ArticleType.ALL,
    type: 'ALL',
    _initiated: false
});


const articlesDetailsSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setOrder: (state, action: PayloadAction<TSortOrder>) => {
            state.order = action.payload;
            state.page = 1;
        },
        setSort: (state, action: PayloadAction<TArticlesSortField>) => {
            state.sort = action.payload;
            state.page = 1;
        },
        setType: (state, action: PayloadAction<TArticlesType>) => {
            state.type = action.payload;
            state.page = 1;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
            state.page = 1;
        },
        initState: (state) => {
            state._initiated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            //* fetchAll
            .addCase(fetchAll.pending, (state, action) => {
                state.error = undefined;
                state.isLoading = true;

                if (action.meta.arg?.replace) {
                    articlesAdapter.removeAll(state);
                }
            })
            .addCase(fetchAll.fulfilled, (
                state,
                action,
            ) => {
                state.isLoading = false;
                state.hasMore = action.payload.length >= state.limit;

                if (action.meta.arg?.replace) {
                    articlesAdapter.setAll(state, action.payload);
                } else {
                    articlesAdapter.addMany(state, action.payload);
                }
            })
            .addCase(fetchAll.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //* fetchById
            .addCase(fetchById.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchById.fulfilled, (state, action) => {
                state.isLoading = false;
                articlesAdapter.upsertOne(state, action.payload);
            })
            .addCase(fetchById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

const articlesActionCreators = {
    ...articlesDetailsSlice.actions,
    fetchById,
    fetchAll
};
type TArticlesActionCreators =  typeof articlesActionCreators;

export {
    articlesActionCreators,
    articlesSelector,
    type TArticlesActionCreators
};
export default {
    name: articlesDetailsSlice.name,
    reducer: articlesDetailsSlice.reducer
};
