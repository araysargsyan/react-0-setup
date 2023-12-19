interface IBuildPaths {
    entry: string;
    build: string;
    html: string;
    src: string;
}

type TBuildMode = 'development' | 'production';
type TStyleMode = 'scss' | 'sass' | 's[ac]ss';

interface IBuildOptions {
    styleMode?: TStyleMode;
    mode: TBuildMode;
    paths: IBuildPaths;
    port: number;
    isDev: boolean;
    apiUrl: string;
    mustAnalyzeBundle: boolean;
    project: 'storybook' | 'frontend' | 'jest';
}

interface IBuildEnv {
    MODE: TBuildMode;
    PORT: number;
    apiUrl: string;
}

export type {
    IBuildPaths,
    TStyleMode,
    IBuildOptions,
    IBuildEnv
};
