import { StoryFn } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';


export default function RouterDecorator(Story: StoryFn) {
    return  (
        <BrowserRouter>
            <Story />
        </BrowserRouter>
    );
}

