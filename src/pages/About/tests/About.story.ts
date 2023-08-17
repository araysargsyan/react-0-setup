import { Meta, StoryObj } from '@storybook/react';
import { ETheme } from 'app/providers/theme';
import PagesDecorator from '@config/storybook/lib/decorators/PagesDecorator';

import About from '../About';


const meta: Meta<typeof About> = {
    title: 'pages/About',
    component: About,
    decorators: [ PagesDecorator ]
};

export default meta;
type Story = StoryObj<typeof About>;

export const Light: Story = {};

export const Dark: Story = {
    storyName: `$${ETheme.DARK}`
};
