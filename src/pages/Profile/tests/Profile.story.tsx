import Profile from 'pages/Profile';
import { type Meta, type StoryObj } from '@storybook/react';
import PagesDecorator from '@config/storybook/lib/decorators/PagesDecorator';
import StoreDecorator from '@config/storybook/lib/decorators/StoreDecorator';
import { ETheme } from 'store/UI';


const meta: Meta<typeof Profile> = {
    title: 'pages/Profile',
    component: Profile,
    decorators: [ PagesDecorator ]
};

export default meta;
type Story = StoryObj<typeof Profile>;

export const Light: Story = {};

export const Dark: Story = { storyName: `$${ETheme.DARK}` };
