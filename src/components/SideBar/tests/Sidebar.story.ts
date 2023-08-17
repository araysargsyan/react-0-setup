import { Meta, StoryObj } from '@storybook/react';
import ThemeDecorator from '@config/storybook/lib/decorators/ThemeDecorator';
import { ETheme } from 'app/providers/theme';

import Sidebar from '../Sidebar';


const meta: Meta<typeof Sidebar> = {
    title: 'components/Sidebar',
    component: Sidebar,
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Light: Story = {};

export const Dark: Story = {};
Dark.decorators = [ ThemeDecorator(ETheme.DARK) ];

