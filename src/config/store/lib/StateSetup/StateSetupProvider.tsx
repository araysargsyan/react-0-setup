import {
    type FC, type PropsWithChildren, useEffect 
} from 'react';

import { type TStateSetup } from './types';
import usePageStateSetup from './usePageStateSetup';


const StateSetupProvider: FC<PropsWithChildren<{ setUp: TStateSetup}>> = ({ children, setUp }) => {
    const path = usePageStateSetup(setUp);

    useEffect(() => {
        console.log('%c StateSetupProvider::UPDATE', 'color: #18a4bf', { path });
    });

    return (
        <>
            { children }
        </>
    );
};

export default StateSetupProvider;
