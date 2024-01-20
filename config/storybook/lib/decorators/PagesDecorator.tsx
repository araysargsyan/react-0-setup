import  { type StoryFn } from '@storybook/react';


export default function PagesDecorator(Story: StoryFn) {
    return (
        <div className="content-page">
            <Story />
        </div>
    );
}

