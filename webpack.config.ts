import {Configuration} from 'webpack';
import BuildWebpackConfig from "./config/build/buildWebpackConfig";
import {IBuildEnv, IBuildOptions, IBuildPaths} from "./config/build/types/config";
import {resolve} from "path";


export default (env: IBuildEnv) => {
    const paths: IBuildPaths = {
        entry: resolve(__dirname, 'src', 'index.tsx'),
        build: resolve(__dirname, 'dist'),
        html: resolve(__dirname, 'public', 'index.html'),
    }

    const options: Omit<IBuildOptions, 'isDev'> = {
        port: env.port || 3000,
        mode: env.mode || 'development',
        styleMode: 'scss',
        paths,
    }

    const config: Configuration = BuildWebpackConfig({
        ...options,
        isDev: options.mode === 'development'
    });

    return config;
};
