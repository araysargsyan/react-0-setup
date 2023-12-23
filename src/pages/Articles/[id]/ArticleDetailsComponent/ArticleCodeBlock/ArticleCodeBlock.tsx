import { useTranslation } from 'react-i18next';
import { type FC, memo } from 'react';
import { type IArticleCodeBlock } from 'store/Article';
import _c from 'shared/helpers/classNames';
import Code from 'shared/ui/Code';

import cls from './ArticleCodeBlock.module.scss';


interface IArticleCodeBlockProps {
    className?: string;
    block: IArticleCodeBlock;
}

const ArticleCodeBlock: FC<IArticleCodeBlockProps> = ({ className, block }) => {
    useTranslation();

    return (
        <div className={ _c(cls['article-code-block'],  [ className ]) }>
            <Code text={ block.code } />
        </div>
    );
};

export default memo(ArticleCodeBlock);
