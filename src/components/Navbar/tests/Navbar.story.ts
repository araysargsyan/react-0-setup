import  { type Meta, type StoryObj } from '@storybook/react';
import { ETheme } from 'store/UI';
import StoreDecorator from '@config/storybook/lib/decorators/StoreDecorator';

import Navbar from '../Navbar';


const meta: Meta<typeof Navbar> = {
    title: 'components/Navbar',
    component: Navbar,
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Light: Story = {};
export const Dark: Story = { storyName: `$${ETheme.DARK}` };

export const AuthNavbar: Story = { decorators: [ StoreDecorator({ user: { authData: {} }, }) ] };

