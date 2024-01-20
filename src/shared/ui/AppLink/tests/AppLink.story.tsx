import { type Meta, type StoryObj } from '@storybook/react';
import { ETheme } from 'store/UI';

import AppLink, { EAppLinkTheme } from '../AppLink';


const meta: Meta<typeof AppLink> = {
    title: 'shared-ui/AppLink',
    component: AppLink,
    args: { to: '/' }
};

export default meta;
type Story = StoryObj<typeof AppLink>;


export const Primary: Story = {
    args: {
        children: 'Primary',
        theme: EAppLinkTheme.PRIMARY,
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary',
        theme: EAppLinkTheme.SECONDARY,
    },
};

export const PrimaryDark: Story = {
    args: {
        children: 'PrimaryDark',
        theme: EAppLinkTheme.PRIMARY,
    },
    storyName: `$${ETheme.DARK}`
};

export const SecondaryDark: Story = {
    args: {
        children: 'SecondaryDark',
        theme: EAppLinkTheme.SECONDARY,
    },
    storyName: `$${ETheme.DARK}`
};
