import { useDispatch } from 'react-redux';
import { type TAppDispatch } from 'config/store';


export const useAppDispatch = () => useDispatch<TAppDispatch>();
