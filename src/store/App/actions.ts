import { createAction } from '@reduxjs/toolkit';


export const setIsReducersInitiated = createAction(
    'app/setIsReducersInitiated',
    (payload: boolean) => ({ payload })
);
