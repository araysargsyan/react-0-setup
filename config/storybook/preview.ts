import { type Preview } from '@storybook/react';

import ThemeDecorator from './lib/decorators/ThemeDecorator';
import StoreDecorator from './lib/decorators/StoreDecorator';
import RouterDecorator from './lib/decorators/RouterDecorator';
import 'app/styles/index.scss';


const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [
        StoreDecorator({}),
        ThemeDecorator(),
        RouterDecorator
    ],
};

export default preview;
