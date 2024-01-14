import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_SCROLL_KEY } from 'shared/const';

import { type IUISchema } from '../model';
import { getScrollPosition } from './actionCreators';


const initialState: IUISchema = { scroll: JSON.parse(localStorage.getItem(LOCAL_STORAGE_SCROLL_KEY) || '{}') };

const UISlice = createSlice({
    name: 'UI',
    initialState,
    reducers: {
        setScrollPosition: (state, { payload }: PayloadAction<{ path: string; position: number }>) => {
            state.scroll[payload.path] = payload.position;
            localStorage.setItem(LOCAL_STORAGE_SCROLL_KEY, JSON.stringify(state.scroll));
        },
    },
});

const UIActionCreators = { ...UISlice.actions, getScrollPosition };

export { UIActionCreators };
export default {
    name: UISlice.name,
    reducer: UISlice.reducer
};
