import  { type StoryFn } from '@storybook/react';
import  { type DeepPartial } from '@reduxjs/toolkit';
import  { type IStateSchema } from 'store';
import StoreProvider from 'app/providers/StoreProvider';


export default function StoreDecorator(state: DeepPartial<IStateSchema>) {
    // eslint-disable-next-line react/display-name
    return (StoryComponent: StoryFn) => (
        <StoreProvider initialState={ state }>
            <StoryComponent />
        </StoreProvider>
    );
}
