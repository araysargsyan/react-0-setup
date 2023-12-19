import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import { type FC } from 'react';

import cls from './ArticleDetails.module.scss';


interface IArticleDetailsPageProps {
    className?: string;
}

const ArticleDetails: FC<IArticleDetailsPageProps> = ({ className }) => {
    useTranslation();

    return (
        <div className={ _c(cls['article-details-page'],  [ className ]) }>
            ARTICLE DETAILS
        </div>
    );
};

export default ArticleDetails;
