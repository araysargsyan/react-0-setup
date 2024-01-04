import { createSelector } from '@reduxjs/toolkit';
import { type IStateSchema } from 'config/store';


const getUIScroll = ({ UI }: IStateSchema) => UI.scroll;
const getUIScrollByPath = createSelector(
    getUIScroll,
    (scroll) => (path: string) => scroll[path],
);

export { getUIScrollByPath };

