import { type Meta, type StoryObj } from '@storybook/react';
import { ETheme } from 'app/providers/theme';

import AppButton, { EAppButtonSize, EAppButtonTheme } from '../AppButton';


const meta: Meta<typeof AppButton> = {
    title: 'shared-ui/AppButton',
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

export const ClearInverted: Story = {
    args: {
        children: 'CLEAR_INVERTED',
        theme: EAppButtonTheme.CLEAR_INVERTED
    }
};

export const Outline: Story = {
    args: {
        children: 'Outline',
        theme: EAppButtonTheme.OUTLINE
    },
};

export const OutlineDark: Story = {
    args: {
        children: 'OutlineDark',
        theme: EAppButtonTheme.OUTLINE,
    },
    storyName: `$${ETheme.DARK}`
};

export const OutlineSizeL: Story = {
    args: {
        children: 'OutlineSizeL',
        theme: EAppButtonTheme.OUTLINE,
        size: EAppButtonSize.L,
    }
};

export const OutlineSizeXl: Story = {
    args: {
        children: 'OutlineSizeXl',
        theme: EAppButtonTheme.OUTLINE,
        size: EAppButtonSize.XL,
    }
};

export const BackgroundTheme: Story = {
    args: {
        children: 'BackgroundTheme',
        theme: EAppButtonTheme.BACKGROUND,
    },
};

export const BackgroundInverted: Story = {
    args: {
        children: 'BackgroundInverted',
        theme: EAppButtonTheme.BACKGROUND_INVERTED,
    },
};

export const Square: Story = {
    args: {
        children: '>',
        theme: EAppButtonTheme.BACKGROUND_INVERTED,
        square: true
    },
};

export const SquareSizeL: Story = {
    args: {
        children: '>',
        theme: EAppButtonTheme.BACKGROUND_INVERTED,
        square: true,
        size: EAppButtonSize.L,
    },
};

export const SquareSizeXl: Story = {
    args: {
        children: '>',
        theme: EAppButtonTheme.BACKGROUND_INVERTED,
        square: true,
        size: EAppButtonSize.XL,
    },
};

export const Disabled = {
    args: {
        children: '>',
        theme: EAppButtonTheme.OUTLINE,
        disabled: true,
    }
};
