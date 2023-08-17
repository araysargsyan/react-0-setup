import { type Preview } from '@storybook/react';

import ThemeDecorator from './lib/decorators/ThemeDecorator';
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
        ThemeDecorator(),
        RouterDecorator
    ]
};

export default preview;
