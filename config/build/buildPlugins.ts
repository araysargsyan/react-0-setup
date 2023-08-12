import HTMLWebpackPlugin from "html-webpack-plugin";
import {ProgressPlugin, WebpackPluginInstance, DefinePlugin} from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default function (template: string, isDev: boolean): WebpackPluginInstance[] {
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
       })
   ]
}
