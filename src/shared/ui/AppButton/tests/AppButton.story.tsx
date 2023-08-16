import { type Meta, type StoryObj } from '@storybook/react';
import ThemeDecorator from '@config/storybook/lib/decorators/ThemeDecorator';
import { ETheme } from 'app/providers/theme';

import AppButton, { EAppButtonTheme } from '../AppButton';


const meta: Meta<typeof AppButton> = {
    title: 'shared/AppButton',
    component: AppButton,
};

export default meta;
type Story = StoryObj<typeof AppButton>;


export const Primary: Story = {
    args: {
        children: 'Primary',
    }
};

export const Clear: Story = {
    args: {
        children: 'Clear',
        theme: EAppButtonTheme.CLEAR
    }
};

export const Outline: Story = {
    args: {
        children: 'Outline',
        theme: EAppButtonTheme.OUTLINE
    },
    decorators: [ ThemeDecorator(ETheme.DARK) ]
};
