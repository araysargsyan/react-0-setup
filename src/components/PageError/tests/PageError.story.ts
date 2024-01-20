import  { type Meta, type StoryObj } from '@storybook/react';
import { ETheme } from 'store/UI';

import PageError from '../PageError';


const meta: Meta<typeof PageError> = {
    title: 'components/PageError',
    component: PageError,
};

export default meta;
type Story = StoryObj<typeof PageError>;

export const Light: Story = {};

export const Dark: Story = { storyName: `$${ETheme.DARK}` };
