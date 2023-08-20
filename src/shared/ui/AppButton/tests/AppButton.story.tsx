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

export const Outline: Story = {
    args: {
        children: 'Outline',
        theme: EAppButtonTheme.OUTLINE
    },
};

export const OutlineDark = {
    args: {
        children: 'OutlineDark',
        theme: EAppButtonTheme.OUTLINE,
    },
    storyName: `$${ETheme.DARK}`
};

export const OutlineSizeL = {
    args: {
        children: 'OutlineSizeL',
        theme: EAppButtonTheme.OUTLINE,
        size: EAppButtonSize.L,
    }
};

export const OutlineSizeXl = {
    args: {
        children: 'OutlineSizeXl',
        theme: EAppButtonTheme.OUTLINE,
        size: EAppButtonSize.XL,
    }
};

export const BackgroundTheme = {
    args: {
        children: 'BackgroundTheme',
        theme: EAppButtonTheme.BACKGROUND,
    },
};

export const BackgroundInverted = {
    args: {
        children: 'BackgroundInverted',
        theme: EAppButtonTheme.BACKGROUND_INVERTED,
    },
};

export const Square = {
    args: {
        children: '>',
        theme: EAppButtonTheme.BACKGROUND_INVERTED,
        square: true
    },
};

export const SquareSizeL = {
    args: {
        children: '>',
        theme: EAppButtonTheme.BACKGROUND_INVERTED,
        square: true,
        size: EAppButtonSize.L,
    },
};

export const SquareSizeXl = {
    args: {
        children: '>',
        theme: EAppButtonTheme.BACKGROUND_INVERTED,
        square: true,
        size: EAppButtonSize.XL,
    },
};
