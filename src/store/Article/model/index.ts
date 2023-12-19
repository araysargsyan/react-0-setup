const ArticleBlockType = {
    CODE: 'CODE',
    IMAGE: 'IMAGE',
    TEXT: 'TEXT'
} as const;
const ArticleType = {
    IT: 'IT',
    SCIENCE: 'SCIENCE',
    ECONOMICS: 'ECONOMICS'
} as const;

interface IArticleBlockBase {
    id: string;
    type: ValueOf<typeof ArticleBlockType>;
}
interface IArticleCodeBlock extends IArticleBlockBase {
    type: typeof ArticleBlockType.CODE;
    code: string;
}
interface IArticleImageBlock extends IArticleBlockBase {
    type: typeof ArticleBlockType.IMAGE;
    src: string;
    title: string;
}
interface IArticleTextBlock extends IArticleBlockBase {
    type: typeof ArticleBlockType.TEXT;
    paragraphs: string[];
    title?: string;
}
type IArticleBlock = IArticleCodeBlock | IArticleImageBlock | IArticleTextBlock;

interface IArticle {
    id: string;
    title: string;
    subtitle: string;
    img: string;
    views: number;
    createdAt: string;
    type: ValueOf<typeof ArticleType>[];
    blocks: IArticleBlock[];
}

export {
    type IArticle,
    type IArticleBlock,
    type IArticleCodeBlock,
    type IArticleImageBlock,
    type IArticleTextBlock,
    ArticleBlockType,
    ArticleType
};
