import { type Params } from 'react-router-dom';

import { type TCb } from '../types';


export function createCb<
    P extends Params<string> = Params<string>
>(cb: TCb<P>): TCb<P> {
    const regex =/return.*?\.(\w+)\.bind\s*\(/;
    // @ts-ignore
    cb.type = regex.exec(cb.toString())?.[1];
    return cb;
}
