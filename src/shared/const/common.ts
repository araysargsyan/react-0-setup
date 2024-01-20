export const Routes = {
    MAIN: '/',
    TEST: '/test',
    // LOGIN: '/login',
    ABOUT: '/about',
    PROFILE: '/profile',
    ARTICLES: '/articles',
    ARTICLE_DETAILS: '/articles/:id',
    NOT_FOUND: '*'
} as const;

export const LOCAL_STORAGE_THEME_KEY = 'theme' as const;
export const LOCAL_STORAGE_SCROLL_KEY = 'scroll' as const;
export const LOCAL_STORAGE_SIDEBAR_KEY = 'collapsed' as const;
export const USER_LOCALSTORAGE_KEY = 'user' as const;
export const appReducerName = 'app' as const;
