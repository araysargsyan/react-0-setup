import { type Meta, type StoryObj } from '@storybook/react';
import { ETheme } from 'store/UI';

import Loader from '../Loader';


const meta: Meta<typeof Loader> = {
    title: 'shared-ui/Loader',
    component: Loader,
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Light: Story = {};

export const Dark: Story = { storyName: `$${ETheme.DARK}` };
