import  { type StoryFn } from '@storybook/react';
import StoreProvider from 'app/providers/StoreProvider';
import { type DeepPartial } from '@reduxjs/toolkit';
import { type IStateSchema } from 'config/store';


export default function StoreDecorator(state: DeepPartial<IStateSchema>) {
    // eslint-disable-next-line react/display-name
    return (StoryComponent: StoryFn) => (
        <StoreProvider initialState={ state as IStateSchema }>
            <StoryComponent />
        </StoreProvider>
    );
}
