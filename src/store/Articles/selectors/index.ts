import { type IStateSchema } from 'config/store';

import { ArticlesSortField, ArticlesType } from '../index';


export const getArticlesIsLoading = ({ articles }: IStateSchema) => articles?.isLoading || false;
export const getArticlesError = ({ articles }: IStateSchema) => articles?.error;
export const getArticlesNum = ({ articles }: IStateSchema) => articles?.page || 1;
export const getArticlesLimit = ({ articles }: IStateSchema) => articles?.limit || 9;
export const getArticlesHasMore = ({ articles }: IStateSchema) => articles?.hasMore;
export const getArticlesInited = ({ articles }: IStateSchema) => articles?._initiated;
export const getArticlesOrder = ({ articles }: IStateSchema) => articles?.order ?? 'asc';
export const getArticlesSort = ({ articles }: IStateSchema) => articles?.sort ?? ArticlesSortField.CREATED;
export const getArticlesSearch = ({ articles }: IStateSchema) => articles?.search ?? '';
export const getArticlesType = ({ articles }: IStateSchema) => articles?.type ?? ArticlesType.ALL;
