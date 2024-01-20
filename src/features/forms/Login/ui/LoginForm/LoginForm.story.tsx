import { type Meta, type StoryObj } from '@storybook/react';
import StoreDecorator from '@config/storybook/lib/decorators/StoreDecorator';
import { combineReducers } from '@reduxjs/toolkit';
import { ETheme } from 'store/UI';

import loginReducer from '../../model';
import LoginForm from './LoginForm';


const meta: Meta<typeof LoginForm> = {
    title: 'features/LoginForm',
    component: LoginForm,
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Primary: Story = {
    decorators: [ StoreDecorator(
        { forms: { login: { username: '123', password: 'asd' } }, },
        { forms: combineReducers({ login: loginReducer.reducer }) }
    ) ]
};

export const WithError: Story = {
    decorators: [ StoreDecorator(
        {
            forms: {
                login: {
                    username: '123', password: 'asd', error: 'ERROR'
                },
            }
        },
        { forms: combineReducers({ login: loginReducer.reducer }) }
    ) ],
    storyName: `$${ETheme.DARK}`
};

export const Loading: Story = {
    decorators: [ StoreDecorator(
        { forms: { login: { isLoading: true }, } },
        { forms: combineReducers({ login: loginReducer.reducer }) }
    ) ]
};
