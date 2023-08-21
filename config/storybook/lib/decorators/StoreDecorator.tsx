import { StoryFn } from '@storybook/react';
import { DeepPartial } from '@reduxjs/toolkit';
import { IStateSchema } from 'store';
import StoreProvider from 'app/providers/StoreProvider';


export default function StoreDecorator(state: DeepPartial<IStateSchema>) {
    // eslint-disable-next-line react/display-name
    return (StoryComponent: StoryFn) => (
        <StoreProvider initialState={ state }>
            <StoryComponent />
        </StoreProvider>
    );
}
