export interface IBuildPaths {
    entry: string;
    build: string;
    html: string;
    src: string;
}

type TBuildMode = 'development' | 'production';
export type TStyleMode = 'scss' | 'sass' | 's[ac]ss';

export interface IBuildOptions {
    styleMode?: TStyleMode;
    mode: TBuildMode;
    paths: IBuildPaths;
    port: number;
    isDev: boolean;
    apiUrl: string;
    mustAnalyzeBundle: boolean;
}

export interface IBuildEnv {
    MODE: TBuildMode;
    PORT: number;
    apiUrl: string;
}
