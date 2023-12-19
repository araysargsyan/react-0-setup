import { type Configuration } from 'webpack';
import { resolve } from 'path';
import BuildWebpackConfig, {
    type IBuildEnv,
    type IBuildOptions,
    type IBuildPaths
} from '@config/build';


export default (env: IBuildEnv) => {
    //* run scripts with [-- analyzer | analyzer] flag
    const mustAnalyzeBundle = process.argv.includes('analyzer');

    const paths: IBuildPaths = {
        entry: resolve(__dirname, 'src', 'index.tsx'),
        build: resolve(__dirname, 'dist'),
        html: resolve(__dirname, 'public', 'index.html'),
        src: resolve(__dirname, 'src'),
    };

    const options: Omit<IBuildOptions, 'isDev'> = {
        port: Number(env.PORT) || 3000,
        mode: env.MODE || 'development',
        styleMode: 'scss',
        project: 'frontend',
        paths,
        apiUrl: env.apiUrl || 'http://localhost:8000',
        mustAnalyzeBundle
    };

    const config: Configuration = BuildWebpackConfig({
        ...options,
        isDev: options.mode === 'development'
    });

    console.log('WEBPACK', {
        paths, options, config
    });

    return config;
};
