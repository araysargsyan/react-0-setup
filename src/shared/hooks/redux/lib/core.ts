import {
    type TypedUseSelectorHook, useDispatch, useSelector 
} from 'react-redux';
import { type IStateSchema, type TAppDispatch } from 'config/store';


export const useAppDispatch = () => useDispatch<TAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<IStateSchema> = useSelector;
