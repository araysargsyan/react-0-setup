import  { type Meta, type StoryObj } from '@storybook/react';
import { ETheme } from 'app/providers/theme';

import Modal from '../Modal';


const meta: Meta<typeof Modal> = {
    title: 'shared-ui/Modal',
    component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;


export const Primary: Story = {
    args: {
        isOpen: true,
        children: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid commodi consequatur eligendi impedit incidunt necessitatibus possimus quis saepe sunt totam.\n ',
    }
};

export const Dark: Story = {
    args: {
        isOpen: true,
        children: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid commodi consequatur eligendi impedit incidunt necessitatibus possimus quis saepe sunt totam.\n ',
    },
    storyName: `$${ETheme.DARK}`
};
