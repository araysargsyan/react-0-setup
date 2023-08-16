import  { type RuleSetRule } from 'webpack';

import  { type TStyleMode } from './types/config';
import buildCssLoader from './loaders/buildCssLoader';
import buildTypescriptLoader from './loaders/buildTypescriptLoader';
import buildSvgLoader from './loaders/buildSvgLoader';
 
 
export default function(isDev: boolean, styleMode: TStyleMode): RuleSetRule[] {

    const svgLoader = buildSvgLoader();

    const fileLoader = {
        test: /\.(png|jpe?g|gif|woff2|woff)$/i,
        use: [
            {
                loader: 'file-loader',
            },
        ],
    };

    const cssLoader = buildCssLoader(isDev, styleMode || 's[ac]ss');

    //! if ot using typescript - need babel-loader
    const typescriptLoader = buildTypescriptLoader();

    return [
        typescriptLoader,
        cssLoader,
        fileLoader,
        svgLoader
    ];
} 
