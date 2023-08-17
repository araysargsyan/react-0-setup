import { StoryFn } from '@storybook/react';


export default function PagesDecorator(Story: StoryFn) {
    return (
        <div className="content-page">
            <div className="page-wrapper">
                <Story />
            </div>
        </div>
    );
}

