import  { type StoryContext, type StoryFn } from '@storybook/react';
import { ETheme } from 'store/UI';


export default function ThemeDecorator(defaultTheme = ETheme.LIGHT) {
    // eslint-disable-next-line react/display-name
    return (Story: StoryFn, context: StoryContext) => {
        let theme = defaultTheme;
        const storyName = (context.name as ETheme);

        (Object.keys(ETheme) as Array<keyof typeof ETheme>).forEach((key) => {
            const value = ETheme[key];

            if (new RegExp(`\\$${value}$`).test(storyName)) {
                theme = value;
            }
        });

        console.log(theme, 666);

        return (
            <div className={ `app ${theme}` }>
                <Story />
            </div>
        );
    };
}

