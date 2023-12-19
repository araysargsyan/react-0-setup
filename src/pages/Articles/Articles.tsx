import _c from 'shared/helpers/classNames';
import { useTranslation } from 'react-i18next';
import { type FC } from 'react';

import cls from './Articles.module.scss';


interface IArticlesPageProps {
    className?: string;
}

const Articles: FC<IArticlesPageProps> = ({ className }) => {
    useTranslation();

    return (
        <div className={ _c(cls['articles-page'], [ className ]) }>
            ARTICLES PAGE
        </div>
    );
};

export default Articles;
