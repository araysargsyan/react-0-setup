import { type FC, type PropsWithChildren } from 'react';

import { type TStateSetup } from './types';
import usePageStateSetup from './usePageStateSetup';


const StateSetupProvider: FC<PropsWithChildren<{ setUp: TStateSetup}>> = ({ children, setUp }) => {
    const path = usePageStateSetup(setUp);
    console.log(path, '__________________________');

    return (
        <>
            { children }
        </>
    );
};

export default StateSetupProvider;
