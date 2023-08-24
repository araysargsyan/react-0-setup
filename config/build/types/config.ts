export interface IBuildPaths {
    entry: string;
    build: string;
    html: string;
    src: string;
}

type TBuildMode = 'development' | 'production';
export type TStyleMode = 'scss' | 'sass';

export interface IBuildOptions {
    styleMode?: TStyleMode;
    mode: TBuildMode;
    paths: IBuildPaths;
    port: number;
    isDev: boolean;
    mustAnalyzeBundle: boolean;
}

export interface IBuildEnv {
    MODE: TBuildMode;
    PORT: number;
}
