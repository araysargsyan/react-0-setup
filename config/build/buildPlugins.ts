import HTMLWebpackPlugin from "html-webpack-plugin";
import {ProgressPlugin, WebpackPluginInstance} from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default function (template: string): WebpackPluginInstance[] {
   return [
       new HTMLWebpackPlugin({
           template,
       }),
       new ProgressPlugin(),
       new MiniCssExtractPlugin({
           filename: 'css/[name][contenthash:8].css',
           chunkFilename: 'css/[name][contenthash:8].css'
       }),
   ]
}
