import  {
    type Meta, type StoryFn, type StoryObj
} from '@storybook/react';
import { ETheme } from 'store/UI';

import Sidebar from '../ui/Sidebar';


const meta: Meta<typeof Sidebar> = {
    title: 'components/Sidebar',
    component: Sidebar,
    decorators: [
        (Story: StoryFn) => (
            <div className="content-page">
                <Story />
            </div>
        ),
    ]
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Light: Story = {};
export const Dark: Story = { storyName: `$${ETheme.DARK}` };
