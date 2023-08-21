import { StoryFn } from '@storybook/react';
import TranslationProvider from 'app/providers/TranslationProvider';


export default function TranslationDecorator(Story: StoryFn) {
    return (
        <TranslationProvider>
            <Story />
        </TranslationProvider>
    );
}
