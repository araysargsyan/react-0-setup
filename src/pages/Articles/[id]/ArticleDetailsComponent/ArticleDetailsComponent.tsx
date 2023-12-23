import { useTranslation } from 'react-i18next';
import {
    type FC,
    memo,
    useCallback
} from 'react';
import { useSelector } from 'react-redux';
import EyeIcon from 'shared/assets/icons/eye-20-20.svg';
import CalendarIcon from 'shared/assets/icons/calendar-20-20.svg';
import {
    type IArticleBlock,
    getArticleDetailsData,
    getArticleDetailsError,
    getArticleDetailsIsLoading,
    ArticleBlockType
} from 'store/Article';
import _c from 'shared/helpers/classNames';
import AppText, { EAppTextAlign, EAppTextSize } from 'shared/ui/Text';
import AppAvatar from 'shared/ui/AppAvatar';
import Skeleton from 'shared/ui/Skeleton';
import Icon from 'shared/ui/Icon';

import cls from './ArticleDetailsComponent.module.scss';
import ArticleCodeBlock from './ArticleCodeBlock';
import ArticleImageBlock from './ArticleImageBlock';
import ArticleTextBlock from './ArticleTextBlock';


interface IArticleDetailsProps {
    className?: string;
}

const ArticleDetailsComponent: FC<IArticleDetailsProps> = ({ className }) => {
    const { t } = useTranslation();
    const isLoading = useSelector(getArticleDetailsIsLoading);
    const article = useSelector(getArticleDetailsData);
    const error = useSelector(getArticleDetailsError);

    const renderBlock = useCallback((block: IArticleBlock) => {
        switch (block.type) {
            case ArticleBlockType.CODE:
                return (
                    <ArticleCodeBlock
                        key={ block.id }
                        block={ block }
                        className={ cls.block }
                    />
                );
            case ArticleBlockType.IMAGE:
                return (
                    <ArticleImageBlock
                        key={ block.id }
                        block={ block }
                        className={ cls.block }
                    />
                );
            case ArticleBlockType.TEXT:
                return (
                    <ArticleTextBlock
                        key={ block.id }
                        className={ cls.block }
                        block={ block }
                    />
                );
            default:
                return null;
        }
    }, []);

    let content;

    if (isLoading) {
        content = (
            <>
                <Skeleton
                    className={ cls.avatar }
                    maxWidth={ 200 }
                    height={ 200 }
                    border="50%"
                />
                <Skeleton
                    className={ cls.title }
                    maxWidth={ 300 }
                    height={ 32 }
                />
                <Skeleton
                    className={ cls.skeleton }
                    maxWidth={ 600 }
                    height={ 24 }
                />
                <Skeleton
                    className={ cls.skeleton }
                    height={ 200 }
                />
                <Skeleton
                    className={ cls.skeleton }
                    height={ 200 }
                />
            </>
        );
    } else if (error) {
        content = (
            <AppText
                align={ EAppTextAlign.CENTER }
                title={ t('Произошла ошибка при загрузке статьи.') }
            />
        );
    } else {
        content = (
            <>
                <div className={ cls['avatar-wrapper'] }>
                    <AppAvatar
                        size={ 200 }
                        src={ article?.img }
                        className={ cls.avatar }
                    />
                </div>
                <AppText
                    className={ cls.title }
                    title={ article?.title }
                    text={ article?.subtitle }
                    size={ EAppTextSize.L }
                />
                <div className={ cls['article-info'] }>
                    <Icon
                        className={ cls.icon }
                        Svg={ EyeIcon }
                    />
                    <AppText text={ String(article?.views) } />
                </div>
                <div className={ cls['article-info'] }>
                    <Icon
                        className={ cls.icon }
                        Svg={ CalendarIcon }
                    />
                    <AppText text={ article?.createdAt } />
                </div>
                { article?.blocks.map(renderBlock) }
            </>
        );
    }

    return (
        <div className={ _c(cls['article-details'],  [ className ]) }>
            { content }
        </div>
    );
};

export default memo(ArticleDetailsComponent);
