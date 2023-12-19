import  { type RuleSetRule } from 'webpack';

import  { type TStyleMode } from './types';
import buildCssLoader from './loaders/buildCssLoader';
import buildTypescriptLoader from './loaders/buildTypescriptLoader';
import buildSvgLoader from './loaders/buildSvgLoader';


export default function(isDev: boolean, styleMode: TStyleMode = 's[ac]ss'): RuleSetRule[] {

    const svgLoader = buildSvgLoader();

    const fileLoader = {
        test: /\.(png|jpe?g|gif|woff2|woff)$/i,
        use: [
            { loader: 'file-loader', },
        ],
    };

    const cssLoader = buildCssLoader(isDev, styleMode);

    //! if not using typescript - need babel-loader
    const typescriptLoader = buildTypescriptLoader(isDev);

    return [
        typescriptLoader,
        cssLoader,
        fileLoader,
        svgLoader
    ];
}
