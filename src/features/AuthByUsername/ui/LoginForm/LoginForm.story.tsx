import  { type Meta, type StoryObj } from '@storybook/react';
import StoreDecorator from '@config/storybook/lib/decorators/StoreDecorator';

import LoginForm from './LoginForm';


const meta: Meta<typeof LoginForm> = {
    title: 'features/LoginForm',
    component: LoginForm,
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Primary: Story = { decorators: [ StoreDecorator({ login: { username: '123', password: 'asd' }, }) ] };
export const WithError: Story = {
    decorators: [ StoreDecorator({
        login: {
            username: '123', password: 'asd', error: 'ERROR' 
        }, 
    }) ]
};

export const Loading: Story = { decorators: [ StoreDecorator({ login: { isLoading: true }, }) ] };
