import { type IArticles } from 'store/Articles';
import {
    type FC, type HTMLAttributeAnchorTarget, memo
} from 'react';
import { useTranslation } from 'react-i18next';
import EyeIcon from 'shared/assets/icons/eye-20-20.svg';
import AppText from 'shared/ui/Text';
import Icon from 'shared/ui/Icon';
import _c from 'shared/helpers/classNames';
import Card from 'shared/ui/Card';
import AppLink from 'shared/ui/AppLink';
import { Routes } from 'config/router';

import cls from './ArticleList.module.scss';


interface IArticleListItemProps {
    className?: string;
    article: IArticles;
    target?: HTMLAttributeAnchorTarget;
}

export const ArticleListItem: FC<IArticleListItemProps> = ({
    className, article, target,
}) => {
    const { t } = useTranslation();

    const types = (
        <AppText
            text={ article.type.join(', ') }
            className={ cls.types }
        />
    );
    const views = (
        <>
            <AppText
                text={ String(article.views) }
                className={ cls.views }
            />
            <Icon Svg={ EyeIcon } />
        </>
    );

    return (
        <AppLink
            target={ target }
            to={ `${Routes.ARTICLES}/${article.id}` }
            className={ _c(cls['article-list-item'], [ className ]) }
        >
            <Card className={ cls.card }>
                <div className={ cls['image-wrapper'] }>
                    <img
                        alt={ article.title }
                        src={ article.img }
                        className={ cls.img }
                    />
                    <AppText
                        text={ article.createdAt }
                        className={ cls.date }
                    />
                </div>
                <div className={ cls['info-wrapper'] }>
                    { types }
                    { views }
                </div>
                <AppText
                    text={ article.title }
                    className={ cls.title }
                />
            </Card>
        </AppLink>
    );
};

export default memo(ArticleListItem);
