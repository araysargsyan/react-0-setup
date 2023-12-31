import {
    type FC, type HTMLAttributeAnchorTarget, memo
} from 'react';
import _c from 'shared/helpers/classNames';
import { type IArticles } from 'store/Articles';
import { useTranslation } from 'react-i18next';
import AppText, { EAppTextSize } from 'shared/ui/Text';

import cls from './ArticleList.module.scss';
import ArticleListItem from './ArticleListItem';
import ArticleListItemSkeleton from './ArticleListItemSkeleton';


const getSkeletons = () => new Array(9)
    .fill(0)
    .map((item, index) => (
        <ArticleListItemSkeleton
            className={ cls.card }
            key={ index }
        />
    ));
interface IArticleListProps {
    className?: string;
    articles: IArticles[];
    isLoading?: boolean;
    target?: HTMLAttributeAnchorTarget;
}

const ArticleList: FC<IArticleListProps> = ({
    className,
    articles,
    isLoading,
    target,
}) => {
    const { t } = useTranslation();


    // const itemsPerRow = 3;
    // const rowCount = Math.ceil(articles.length / itemsPerRow);


    if (!isLoading && !articles.length) {
        return (
            <div className={ _c(cls['article-list'], [ className ]) }>
                <AppText
                    size={ EAppTextSize.L }
                    title={ t('Статьи не найдены') }
                />
            </div>
        );
    }

    return (
        <div className={ _c(cls['article-list'],  [ className ]) }>
            { isLoading ? getSkeletons() :  articles.map((article) => (
                <ArticleListItem
                    className={ cls.card }
                    article={ article }
                    target={ target }
                    key={ article.id }
                />
            )) }
        </div>
    );
};

export default memo(ArticleList);
