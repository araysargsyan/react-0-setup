import { useTranslation } from 'react-i18next';
import { type FC, memo } from 'react';
import { type IArticleImageBlock } from 'store/Article';
import AppText, { EAppTextAlign } from 'shared/ui/Text';
import _c from 'shared/helpers/classNames';

import cls from './ArticleImageBlock.module.scss';


interface ArticleImageBlockProps {
    className?: string;
    block: IArticleImageBlock;
}

export const ArticleImageBlock: FC<ArticleImageBlockProps> = ({ className, block }) => {
    useTranslation();

    return (
        <div className={ _c(cls['article-image-block'],  [ className ]) }>
            <img
                src={ block.src }
                alt={ block.title }
                className={ cls.img }
            />
            { block.title && (
                <AppText
                    text={ block.title }
                    align={ EAppTextAlign.CENTER }
                />
            ) }
        </div>
    );
};

export default memo(ArticleImageBlock);
