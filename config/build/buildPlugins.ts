import HTMLWebpackPlugin from 'html-webpack-plugin';
import {
    type WebpackPluginInstance,
    DefinePlugin,
    HotModuleReplacementPlugin,
    ProgressPlugin
} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';


export default function(template: string, isDev: boolean): WebpackPluginInstance[] {
    return [
        new HTMLWebpackPlugin({
            template,
        }),
        new ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name][contenthash:8].css',
            chunkFilename: 'css/[name][contenthash:8].css'
        }),
        new DefinePlugin({
            __IS_DEV__: JSON.stringify(isDev)
        }),
        new HotModuleReplacementPlugin(),
        new BundleAnalyzerPlugin({
            openAnalyzer: false
        })
    ]; 
}
