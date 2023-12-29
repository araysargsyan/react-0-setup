import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import { type FC } from 'react';
import { useAppDispatch } from 'shared/hooks/redux';
import Page from 'shared/ui/Page';

import cls from './Articles.module.scss';
import ArticlesFilters from './ArticlesFilters';


interface IArticlesPageProps {
    className?: string;
}


const Articles: FC<IArticlesPageProps> = ({ className }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    // const articles = useSelector(getArticles.selectAll);
    // const isLoading = useSelector(getArticlesPageIsLoading);
    // const view = useSelector(getArticlesPageView);
    // const error = useSelector(getArticlesPageError);
    // const [ searchParams ] = useSearchParams();
    //
    // const onLoadNextPart = useCallback(() => {
    //     dispatch(fetchNextArticlesPage());
    // }, [ dispatch ]);
    //
    //
    return (
        <Page
            // onScrollEnd={ onLoadNextPart }
            className={ _c(cls['articles-page'], [ className ]) }
        >
            <ArticlesFilters />
            { /*<ArticleList*/ }
            { /*    isLoading={ isLoading }*/ }
            { /*    view={ view }*/ }
            { /*    articles={ articles }*/ }
            { /*    className={ cls.list }*/ }
            { /*/>*/ }
        </Page>
    );
};

export default Articles;
