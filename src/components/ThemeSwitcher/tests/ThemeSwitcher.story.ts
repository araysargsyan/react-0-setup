import  { type Meta, type StoryObj } from '@storybook/react';
import { ETheme } from 'app/providers/theme';

import ThemeSwitcher from '../ThemeSwitcher';


const meta: Meta<typeof ThemeSwitcher> = {
    title: 'components/ThemeSwitcher',
    component: ThemeSwitcher,
};

export default meta;
type Story = StoryObj<typeof ThemeSwitcher>;

export const Light: Story = {};

export const Dark: Story = { storyName: `$${ETheme.DARK}` };
