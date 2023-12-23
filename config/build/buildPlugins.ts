import HTMLWebpackPlugin from 'html-webpack-plugin';
import {
    type WebpackPluginInstance,
    DefinePlugin,
    ProgressPlugin,
    //HotModuleReplacementPlugin
} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

import { type IBuildOptions } from './types';

// import Dotenv from 'dotenv-webpack';


export default function(
    isDev: boolean, {
        apiUrl,
        mustAnalyzeBundle,
        project,
        paths
    }: Pick<IBuildOptions, 'paths' | 'project' | 'apiUrl' | 'mustAnalyzeBundle'>
): WebpackPluginInstance[] {
    const plugins: WebpackPluginInstance[] = [
        // new Dotenv({
        //     path: resolve(__dirname, '../../.env')
        // }),
        new HTMLWebpackPlugin({ template: paths.html }),
        new ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name][contenthash:8].css',
            chunkFilename: 'css/[name][contenthash:8].css'
        }),
        new DefinePlugin({
            __IS_DEV__: JSON.stringify(isDev),
            __API__: JSON.stringify(apiUrl),
            __PROJECT__: JSON.stringify(project),
        }),
        new CopyPlugin({ patterns: [ { from: paths.locales, to: paths.buildLocales } ] }),
    ];

    if (isDev || mustAnalyzeBundle) {
        plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: false }));
    }

    if (isDev) {
        plugins.push(...[
            new ReactRefreshWebpackPlugin(),
            // new HotModuleReplacementPlugin()
        ]);
    }

    return plugins;
}
