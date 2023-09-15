import {
    type TypedUseSelectorHook, useDispatch, useSelector 
} from 'react-redux';
import { type IStateSchema, type TAppDispatch } from 'config/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { type IHistoryState } from 'shared/types';
import { type Location } from 'history';

import { type TAppNavigateFunction } from '../types';


export const useAppDispatch = () => useDispatch<TAppDispatch>();
export const useAppLocation = (): Location<IHistoryState | null> => useLocation();
export const useAppSelector: TypedUseSelectorHook<IStateSchema> = useSelector;
export function useAppNavigate() {
    const navigate = useNavigate();
    // const { pathname, state: initialState = {} } = useAppLocation();

    const appNavigate: TAppNavigateFunction = (to, { state, ...options } = {}) => {
        return navigate(to, {
            ...options, state: {
                // ...initialState,
                ...state,
                //from: pathname
            } 
        });
    };

    return appNavigate;
}
