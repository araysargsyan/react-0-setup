import { Meta, StoryObj } from '@storybook/react';
import { ETheme } from 'app/providers/theme';
import StoreDecorator from '@config/storybook/lib/decorators/StoreDecorator';

import Navbar from '../Navbar';


const meta: Meta<typeof Navbar> = {
    title: 'components/Navbar',
    component: Navbar,
    decorators: [ StoreDecorator({}) ]
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Light: Story = {};
export const Dark: Story = {
    storyName: `$${ETheme.DARK}`
};

export const AuthNavbar: Story = {
    decorators: [ StoreDecorator({
        user: { authData: {} },
    }) ]
};

