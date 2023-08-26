import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import ProfilePage from 'pages/Profile/ProfilePage';

import { ThemeDecorator } from '../../../../../../../Downloads/Ulbi Продвинутый react/5. Асинк редюссеры/37 Страница профиля. Оптимизация перерисовок. Учимся использовать memo/production-project-945dc08e724ae8eed36969ea71af7915764b51bb/src/shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from '../../../../../../../Downloads/Ulbi Продвинутый react/5. Асинк редюссеры/37 Страница профиля. Оптимизация перерисовок. Учимся использовать memo/production-project-945dc08e724ae8eed36969ea71af7915764b51bb/src/app/providers/ThemeProvider';
import { StoreDecorator } from '../../../../../../../Downloads/Ulbi Продвинутый react/5. Асинк редюссеры/37 Страница профиля. Оптимизация перерисовок. Учимся использовать memo/production-project-945dc08e724ae8eed36969ea71af7915764b51bb/src/shared/config/storybook/StoreDecorator/StoreDecorator';


export default {
    title: 'pages/ProfilePage',
    component: ProfilePage,
    argTypes: { backgroundColor: { control: 'color' }, },
} as ComponentMeta<typeof ProfilePage>;

const Template: ComponentStory<typeof ProfilePage> = (args) => <ProfilePage { ...args } />;

export const Normal = Template.bind({});
Normal.args = {};
Normal.decorators = [ StoreDecorator({}) ];

export const Dark = Template.bind({});
Dark.args = {};
Dark.decorators = [ ThemeDecorator(Theme.DARK), StoreDecorator({}) ];
