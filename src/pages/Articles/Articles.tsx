import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import { type FC } from 'react';
import { useActions, useAppDispatch } from 'shared/hooks/redux';
import Page from 'components/Page';
import {
    articlesActionCreators,
    articlesSelector, getArticlesError, getArticlesIsLoading
} from 'store/Articles';
import { useSelector } from 'react-redux';

import cls from './Articles.module.scss';
import ArticlesFilters from './ArticlesFilters';
import ArticleList from './ArticleList';


interface IArticlesPageProps {
    className?: string;
}


const Articles: FC<IArticlesPageProps> = ({ className }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const articles = useSelector(articlesSelector.selectAll);
    const isLoading = useSelector(getArticlesIsLoading);
    const error = useSelector(getArticlesError);
    const { fetchNext } = useActions(articlesActionCreators, [ 'fetchNext' ]);
    // const [ searchParams ] = useSearchParams();
    //
    // const onLoadNextPart = useCallback(() => {
    //     dispatch(fetchNextArticlesPage());
    // }, [ dispatch ]);
    //
    //


    return (
        <Page
            onScrollEnd={ fetchNext }
            className={ _c(cls['articles-page'], [ className ]) }
        >
            <ArticlesFilters />
            <ArticleList
                isLoading={ isLoading }
                articles={ articles }
                className={ cls.list }
            />
        </Page>
    );
};

export default Articles;
