import { createAsyncThunk } from '@reduxjs/toolkit';
import { type IThunkConfig } from 'config/store';

import { getUIScrollByPath } from '..';


const getScrollPositionActionType = 'UI/getScrollPosition';
const getScrollPosition = createAsyncThunk<
    number,
    string,
    IThunkConfig<never>
>(getScrollPositionActionType, async (path, { getState, fulfillWithValue }) => {
    return fulfillWithValue(getUIScrollByPath(getState())(path));
});

export { getScrollPosition, getScrollPositionActionType };
