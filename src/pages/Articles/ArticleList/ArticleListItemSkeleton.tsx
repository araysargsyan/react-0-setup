import { type FC, memo } from 'react';
import Card from 'shared/ui/Card';
import Skeleton from 'shared/ui/Skeleton';
import _c from 'shared/helpers/classNames';

import cls from './ArticleList.module.scss';


interface IArticleListItemSkeletonProps {
    className?: string;
}

const ArticleListItemSkeleton: FC<IArticleListItemSkeletonProps> = ({ className }) => {

    return (
        <div className={ _c(cls['article-list-item'], [ className ]) }>
            <Card className={ cls.card }>
                <div className={ cls['image-wrapper'] }>
                    <Skeleton
                        maxWidth={ 200 }
                        height={ 200 }
                        className={ cls.img }
                    />
                </div>
                <div className={ cls['info-wrapper'] }>
                    <Skeleton
                        maxWidth={ 130 }
                        height={ 16 }
                    />
                </div>
                <Skeleton
                    maxWidth={ 150 }
                    height={ 16 }
                    className={ cls.title }
                />
            </Card>
        </div>
    );
};

export default memo(ArticleListItemSkeleton);
