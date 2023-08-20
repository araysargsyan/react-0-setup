import { Meta, StoryObj } from '@storybook/react';
import AppInput from 'shared/ui/AppInput';


const meta: Meta<typeof AppInput> = {
    title: 'shared-ui/AppInput',
    component: AppInput,
};

export default meta;
type Story = StoryObj<typeof AppInput>;

export const Primary: Story = {
    args: {
        placeholder: 'Type text',
        value: '123123',
    }
};
