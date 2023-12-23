import { useTranslation } from 'react-i18next';
import { type FC, memo } from 'react';
import AppText from 'shared/ui/Text/Text';
import { type IArticleTextBlock } from 'store/Article';
import _c from 'shared/helpers/classNames';

import cls from './ArticleTextBlock.module.scss';


interface IArticleTextBlockComponentProps {
    className?: string;
    block: IArticleTextBlock;
}

const ArticleTextBlock: FC<IArticleTextBlockComponentProps> = ({ className, block }) => {
    useTranslation();

    return (
        <div className={ _c(cls['article-text-block'],  [ className ]) }>
            { block.title && (
                <AppText
                    title={ block.title }
                    className={ cls.title }
                />
            ) }
            { block.paragraphs.map((paragraph) => (
                <AppText
                    key={ paragraph }
                    text={ paragraph }
                    className={ cls.paragraph }
                />
            )) }
        </div>
    );
};

export default memo(ArticleTextBlock);
