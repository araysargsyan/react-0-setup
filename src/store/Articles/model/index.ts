import { type EntityState } from '@reduxjs/toolkit';


const ArticlesBlockType = {
    CODE: 'CODE',
    IMAGE: 'IMAGE',
    TEXT: 'TEXT'
} as const;
const ArticlesType = {
    ALL: 'ALL',
    IT: 'IT',
    SCIENCE: 'SCIENCE',
    ECONOMICS: 'ECONOMICS'
} as const;
type TArticlesType = ValueOf<typeof ArticlesType>;

interface IArticlesBlockBase {
    id: string;
    type: ValueOf<typeof ArticlesBlockType>;
}
interface IArticlesCodeBlock extends IArticlesBlockBase {
    type: typeof ArticlesBlockType.CODE;
    code: string;
}
interface IArticlesImageBlock extends IArticlesBlockBase {
    type: typeof ArticlesBlockType.IMAGE;
    src: string;
    title: string;
}
interface IArticlesTextBlock extends IArticlesBlockBase {
    type: typeof ArticlesBlockType.TEXT;
    paragraphs: string[];
    title?: string;
}
type IArticlesBlock = IArticlesCodeBlock | IArticlesImageBlock | IArticlesTextBlock;

interface IArticles {
    id: string;
    title: string;
    subtitle: string;
    img: string;
    views: number;
    createdAt: string;
    type: ValueOf<typeof ArticlesType>[];
    blocks: IArticlesBlock[];
}

type TSortOrder = 'asc' | 'desc';
const ArticlesSortField = {
    VIEWS: 'views',
    TITLE: 'title',
    CREATED: 'createdAt',
} as const;
type TArticlesSortField = ValueOf<typeof ArticlesSortField>;
interface IArticlesSchema extends EntityState<IArticles> {
    isLoading?: boolean;
    error?: string;

    // pagination
    page: number;
    limit: number;
    hasMore: boolean;

    // filters
    order: TSortOrder;
    sort: TArticlesSortField;
    type: TArticlesType;
    search: string;

    _initiated: boolean;
}

export {
    type IArticles,
    type IArticlesBlock,
    type IArticlesCodeBlock,
    type IArticlesImageBlock,
    type IArticlesTextBlock,
    type IArticlesSchema,
    type TSortOrder,
    type TArticlesSortField,
    type TArticlesType,
    ArticlesBlockType,
    ArticlesType,
    ArticlesSortField
};
