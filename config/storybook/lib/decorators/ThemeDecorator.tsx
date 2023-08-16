import { StoryFn } from '@storybook/react';
import { ETheme } from 'app/providers/theme';


export default function ThemeDecorator(theme = ETheme.LIGHT) {
    // eslint-disable-next-line react/display-name
    return (Story: StoryFn) => (
        <div className={ `app ${theme}` }>
            <Story />
        </div>
    );
}

