export interface IBuildPaths {
    entry: string;
    build: string;
    html: string;
}

type TBuildMode = 'development' | 'production'
export type TStyleMode = 'scss' | 'sass'

export interface IBuildOptions {
    styleMode?: TStyleMode;
    mode: TBuildMode;
    paths: IBuildPaths;
    isDev: boolean;
    port: number;
}

export interface IBuildEnv {
    mode: TBuildMode;
    port: number;
}
