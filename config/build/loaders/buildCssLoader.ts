import { loader as MiniCssExtractLoader } from 'mini-css-extract-plugin';

import { type TStyleMode } from '../types';


export default function(isDev: boolean, styleMode: TStyleMode) {
    return  {
        test: new RegExp(`\.${styleMode}$`, 'i'),
        use: [
            isDev ? 'style-loader' : MiniCssExtractLoader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: new RegExp(`\.module\.${styleMode}$`, 'i'),
                        //localIdentName: isDev ? '[local]-[hash:base64:8]__[name]__[path]' : '[local]-[hash:base64:8]',
                        localIdentName: '[local]-[hash:base64:8]',
                    },
                }
            },
            'sass-loader'
        ]
    };
}
