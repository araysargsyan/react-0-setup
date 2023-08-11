import {IBuildOptions} from "./types/config";
import {Configuration} from "webpack";
import buildPlugins from "./buildPlugins";
import buildLoaders from "./buildLoaders";
import buildResolvers from "./buildResolvers";
import buildDevServer from "./buildDevServer";

export default function ({paths, mode, port, isDev, styleMode}: IBuildOptions): Configuration {
    return {
        mode,
        entry: paths.entry,
        output: {
            filename: '[name][contenthash].js',
            path: paths.build,
            clean: true
        },
        plugins: buildPlugins(paths.html),
        module: {
            rules: buildLoaders(isDev, styleMode),
        },
        resolve: buildResolvers(paths.src),
        devtool: isDev ? 'inline-source-map' : undefined,
        devServer: isDev ? buildDevServer(port) : undefined
    };
}
