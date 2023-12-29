import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import { type FC } from 'react';
import Page from 'shared/ui/Page';

import cls from './ArticleDetails.module.scss';
import ArticleDetailsComponent from './ArticleDetailsComponent';


interface IArticleDetailsPageProps {
    className?: string;
}

const ArticleDetails: FC<IArticleDetailsPageProps> = ({ className }) => {
    useTranslation();

    return (
        <Page
            className={ _c(cls['article-details-page'],  [ className ]) }
            onScrollEnd={ () => console.log(666) }
        >
            <ArticleDetailsComponent />
        </Page>
    );
};

export default ArticleDetails;
