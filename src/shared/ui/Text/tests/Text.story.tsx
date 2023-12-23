import  { type Meta, type StoryObj } from '@storybook/react';
import { ETheme } from 'app/providers/theme';

import AppText, { EAppTextTheme } from '..';


const meta: Meta<typeof AppText> = {
    title: 'shared-ui/AppText',
    component: AppText,
};

export default meta;
type Story = StoryObj<typeof AppText>;

export const Primary: Story = {
    args: {
        title: 'Title lorem ipsun',
        text: 'Description Description Description Description',
    }
};

export const Error: Story = {
    args: {
        title: 'Title lorem ipsun',
        text: 'Description Description Description Description',
        theme: EAppTextTheme.ERROR,
    }
};

export const onlyTitle: Story = { args: { title: 'Title lorem ipsun', } };

export const onlyText: Story = { args: { text: 'Description Description Description Description', } };

export const PrimaryDark: Story = {
    args: {
        title: 'Title lorem ipsun',
        text: 'Description Description Description Description',
    },
    storyName: `$${ETheme.DARK}`
};

export const onlyTitleDark: Story = {
    args: { title: 'Title lorem ipsun', },
    storyName: `$${ETheme.DARK}`
};

export const onlyTextDark: Story = {
    args: { text: 'Description Description Description Description', },
    storyName: `$${ETheme.DARK}`
};
