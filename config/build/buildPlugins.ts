import HTMLWebpackPlugin from 'html-webpack-plugin';
import {
    type WebpackPluginInstance,
    DefinePlugin,
    ProgressPlugin,
} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// import Dotenv from 'dotenv-webpack';


export default function(template: string, isDev: boolean, apiUrl: string, mustAnalyzeBundle: boolean): WebpackPluginInstance[] {
    const plugins: WebpackPluginInstance[] = [
        // new Dotenv({
        //     path: resolve(__dirname, '../../.env')
        // }),
        new HTMLWebpackPlugin({ template, }),
        new ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name][contenthash:8].css',
            chunkFilename: 'css/[name][contenthash:8].css'
        }),
        new DefinePlugin({
            __IS_DEV__: JSON.stringify(isDev),
            __API__: JSON.stringify(apiUrl),
        }),
    ];

    if (isDev || mustAnalyzeBundle) {
        // plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: false }));
    }

    return plugins;
}
