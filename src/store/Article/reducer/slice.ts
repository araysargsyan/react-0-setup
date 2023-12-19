import { createSlice } from '@reduxjs/toolkit';
import { fetchById } from 'store/Article/reducer/actionCreators';
import { type IArticle } from 'store/Article';


export interface IArticleDetailsSchema {
    isLoading: boolean;
    error?: string;
    data?: IArticle;
}

const initialState: IArticleDetailsSchema = {
    isLoading: false,
    error: undefined,
    data: undefined,
};

export const articleDetailsSlice = createSlice({
    name: 'articleDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchById.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const articleDetailsActionCreators = {
    ...articleDetailsSlice.actions,
    fetchById

};
export default {
    name: articleDetailsSlice.name,
    reducer: articleDetailsSlice.reducer
};
