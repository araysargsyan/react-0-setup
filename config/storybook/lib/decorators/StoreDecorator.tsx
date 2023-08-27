import  { type StoryFn } from '@storybook/react';
import StoreProvider from 'app/providers/StoreProvider';
import { type ReducersMapObject } from '@reduxjs/toolkit';
import { type IStateSchema } from 'config/store';


export default function StoreDecorator(
    state: DeepPartial<IStateSchema>,
    asyncReducers?: DeepPartial<ReducersMapObject<IStateSchema>>
) {
    // eslint-disable-next-line react/display-name
    return (StoryComponent: StoryFn) => (
        <StoreProvider
            initialState={ state as IStateSchema }
            asyncReducers={ asyncReducers as ReducersMapObject<IStateSchema> }
        >
            <StoryComponent />
        </StoreProvider>
    );
}
