import  { type StoryContext, type StoryFn } from '@storybook/react';
import ThemeProvider, { ETheme } from 'app/providers/theme';


export default function ThemeDecorator(defaultTheme = ETheme.LIGHT) {
    // eslint-disable-next-line react/display-name
    return (Story: StoryFn, context: StoryContext) => {
        let theme = defaultTheme;
        const storyName = (context.name as ETheme);

        Object.keys(ETheme).forEach((key: keyof typeof ETheme) => {
            const value = ETheme[key];

            if (new RegExp(`\\$${value}$`).test(storyName)) {
                theme = value;
            }
        });

        return (
            <ThemeProvider initialTheme={ theme }>
                <div className={ `app ${theme}` }>
                    <Story />
                </div>
            </ThemeProvider>
        );
    };
}

