import  { type Meta, type StoryObj } from '@storybook/react';
import { ETheme } from 'app/providers/theme';
import PagesDecorator from '@config/storybook/lib/decorators/PagesDecorator';

import NotFound from '../NotFound';


const meta: Meta<typeof NotFound> = {
    title: 'pages/NotFound',
    component: NotFound,
    decorators: [ PagesDecorator ]
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Light: Story = {};

export const Dark: Story = { storyName: `$${ETheme.DARK}` };
