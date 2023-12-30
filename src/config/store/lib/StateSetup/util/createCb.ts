import { type Params } from 'react-router-dom';

import { type TCb } from '../types';


export function createCb<
    P extends Params<string> = Params<string>
>(cb: TCb<P>): TCb<P> {
    return cb;
}
