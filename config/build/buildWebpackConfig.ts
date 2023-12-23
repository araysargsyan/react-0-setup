import { type Configuration } from 'webpack';

import { type IBuildOptions } from './types';
import buildPlugins from './buildPlugins';
import buildLoaders from './buildLoaders';
import buildResolvers from './buildResolvers';
import buildDevServer from './buildDevServer';


export default function({
    paths, mode, port, isDev, styleMode, apiUrl, mustAnalyzeBundle, project
}: IBuildOptions): Configuration {
    return {
        mode,
        entry: paths.entry,
        output: {
            filename: '[name][contenthash].js',
            path: paths.build,
            publicPath: '/',
            clean: true
        },
        plugins: buildPlugins(isDev, {
            template: paths.html,
            apiUrl,
            mustAnalyzeBundle,
            project
        }),
        module: { rules: buildLoaders(isDev, styleMode), },
        resolve: buildResolvers(paths.src, paths.locales),
        devtool: isDev ? 'inline-source-map' : undefined,
        devServer: isDev ? buildDevServer(port) : undefined,
        performance: {
            maxEntrypointSize: 600000,
            maxAssetSize: 600000
        },
    };
}
