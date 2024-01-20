export type IScroll = Record<string, number>;
export enum ETheme {
    LIGHT = 'app-light-theme',
    DARK = 'app-dark-theme'
}

export interface IUISchema {
    scroll: IScroll;
    theme: ETheme;
    collapsed: boolean;
}
