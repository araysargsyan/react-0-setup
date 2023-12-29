import { type FC, memo } from 'react';

import { type TUseRedirectionContext } from '../types';
import { type TRedirectionTypes } from '../core/const';


export function createRedirectionModal(modal: FC<{ useContext: TUseRedirectionContext<TRedirectionTypes> }>) {
    return memo(modal);
}
