import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
    LOCAL_STORAGE_SCROLL_KEY, LOCAL_STORAGE_SIDEBAR_KEY, LOCAL_STORAGE_THEME_KEY
} from 'shared/const';

import { ETheme, type IUISchema } from '../model';
import { getScrollPosition } from './actionCreators';


const initialState: IUISchema = {
    scroll: JSON.parse(localStorage.getItem(LOCAL_STORAGE_SCROLL_KEY) || '{}'),
    theme: localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as ETheme || ETheme.LIGHT,
    collapsed: Boolean(localStorage.getItem(LOCAL_STORAGE_SIDEBAR_KEY)) || false,
};

const UISlice = createSlice({
    name: 'UI',
    initialState,
    reducers: {
        setScrollPosition: (state, { payload }: PayloadAction<{ path: string; position: number }>) => {
            state.scroll[payload.path] = payload.position;
            localStorage.setItem(LOCAL_STORAGE_SCROLL_KEY, JSON.stringify(state.scroll));
        },
        setTheme: (state, { payload }: PayloadAction<ETheme>) => {
            state.theme = payload;
            localStorage.setItem(LOCAL_STORAGE_THEME_KEY, payload);
        },
        toggleCollapsed: (state) => {
            state.collapsed = !state.collapsed;
            if (state.collapsed) {
                localStorage.setItem(LOCAL_STORAGE_SIDEBAR_KEY, String(state.collapsed));
            } else {
                localStorage.removeItem(LOCAL_STORAGE_SIDEBAR_KEY);
            }
        }
    },
});

const UIActionCreators = { ...UISlice.actions, getScrollPosition };

export { UIActionCreators };
export default {
    name: UISlice.name,
    reducer: UISlice.reducer
};
