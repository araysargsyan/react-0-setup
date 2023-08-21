import  { type StorybookConfig } from '@storybook/react-webpack5';
import { join, resolve } from 'path';
import  { type RuleSetRule, DefinePlugin } from 'webpack';


import buildWebpackRules from './lib/buildWebpackRules';


const config: StorybookConfig = {
    stories: [ '../../src/**/*.story.@(js|jsx|ts|tsx)' ],
    addons: [
        // '@storybook/addon-links',
        // '@storybook/addon-essentials',
        // '@storybook/addon-onboarding',
        // '@storybook/addon-interactions',
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    docs: { autodocs: 'tag', },
    webpackFinal: async (config) => {
        config.module.rules = buildWebpackRules(config.module.rules as RuleSetRule[]);

        const rootPath = resolve(__dirname, '../../');

        config.resolve.modules.push(join(rootPath, 'src'));
        config.resolve.alias = { '@config': join(rootPath, 'config') };
        config.resolve.extensions.push('.ts', '.tsx');

        config.plugins.push(new DefinePlugin({ __IS_DEV__: true }));

        return config;
    },
};
export default config;
