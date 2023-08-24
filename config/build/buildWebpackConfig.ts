import  { type Configuration } from 'webpack';

import  { type IBuildOptions } from './types/config';
import buildPlugins from './buildPlugins';
import buildLoaders from './buildLoaders';
import buildResolvers from './buildResolvers';
import buildDevServer from './buildDevServer';
 
 
export default function({
    paths, mode, port, isDev, styleMode, mustAnalyzeBundle
}: IBuildOptions): Configuration {
    return {
        mode,
        entry: paths.entry,
        output: {
            filename: '[name][contenthash].js',
            path: paths.build,
            clean: true
        },
        plugins: buildPlugins(paths.html, isDev, mustAnalyzeBundle),
        module: { rules: buildLoaders(isDev, styleMode), },
        resolve: buildResolvers(paths.src),
        devtool: isDev ? 'inline-source-map' : undefined,
        devServer: isDev ? buildDevServer(port) : undefined,
        performance: {
            maxEntrypointSize: 400000,
            maxAssetSize: 400000
        },
    };
}
