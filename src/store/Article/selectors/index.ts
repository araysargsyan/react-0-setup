import { type IStateSchema } from 'config/store';


export const getArticleDetailsData = ({ articleDetails }: IStateSchema) => articleDetails?.data;
export const getArticleDetailsError = ({ articleDetails }: IStateSchema) => articleDetails?.error;
export const getArticleDetailsIsLoading = ({ articleDetails }: IStateSchema) => Boolean(articleDetails?.isLoading);
