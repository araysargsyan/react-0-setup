import  { type Meta, type StoryObj } from '@storybook/react';
import { ETheme } from 'app/providers/theme';
import PagesDecorator from '@config/storybook/lib/decorators/PagesDecorator';

import Main from '../Main';


const meta: Meta<typeof Main> = {
    title: 'pages/Main',
    component: Main,
    decorators: [ PagesDecorator ]
};

export default meta;
type Story = StoryObj<typeof Main>;

export const Light: Story = {};

export const Dark: Story = { storyName: `$${ETheme.DARK}` };
