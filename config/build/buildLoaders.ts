import {loader as MiniCssExtractLoader} from "mini-css-extract-plugin";
import type {RuleSetRule} from "webpack";
import {TStyleMode} from "./types/config";

export default function (isDev: boolean, styleMode: TStyleMode): RuleSetRule[] {

    const svgLoader = {
        test: /\.svg$/,
        use: ['@svgr/webpack']
    }

    const fileLoader = {
        test: /\.(png|jpe?g|gif|woff2|woff)$/i,
        use: [
            {
                loader: 'file-loader',
            },
        ],
    }

    const pattern = styleMode || 's[ac]ss';
    const cssLoader = {
        test: new RegExp(`\.${pattern}$`, 'i'),
        use: [
            isDev ? 'style-loader' : MiniCssExtractLoader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: new RegExp(`\.module\.${pattern}$`, 'i'),
                        localIdentName: isDev ? '[local]-[hash:base64:8]__[name]__[path]' : '[local]-[hash:base64:8]',
                    },
                }
            },
            'sass-loader'
        ]
    }

    //! if ot using typescript - need babel-loader
    const typescriptLoader = {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    }

    return [
        typescriptLoader,
        cssLoader,
        fileLoader,
        svgLoader
    ]
}
