import  { type RuleSetRule } from 'webpack';

import buildTypescriptLoader from '../../build/loaders/buildTypescriptLoader';
import buildCssLoader from '../../build/loaders/buildCssLoader';
import buildSvgLoader from '../../build/loaders/buildSvgLoader';


export default function(rules: RuleSetRule[]): RuleSetRule[] {
    const typescriptLoader = buildTypescriptLoader();
    const cssLoader = buildCssLoader(true, 'scss');
    const svgLoader = buildSvgLoader();

    const newRules = rules.map((rule) => {
        if (/svg/.test(rule.test as string)) {
            return { ...rule, exclude: /\.svg$/i };
        }

        return rule;
    });

    newRules.push(...[
        typescriptLoader,
        cssLoader,
        svgLoader
    ]);

    return newRules;
}
