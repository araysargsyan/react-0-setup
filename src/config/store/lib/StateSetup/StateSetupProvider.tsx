import {
    type FC,
    type PropsWithChildren,
    useEffect
} from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'shared/hooks/redux';

import {
    type TAsyncReducer,
    type TCheckAuthorizationAsyncThunk,
    type TStateSetup
} from './types';
import usePageStateSetup from './usePageStateSetup';


const StateSetupProvider: FC<PropsWithChildren<{
    setUp: TStateSetup;
    checkAuthorization: TCheckAuthorizationAsyncThunk;
    asyncReducer?: TAsyncReducer;
}>> = ({
    children,
    setUp,
    checkAuthorization,
    asyncReducer
}) => {
    const path = usePageStateSetup(setUp, checkAuthorization, asyncReducer);
    const isAppReady = useAppSelector(({ app }) => app.isAppReady);

    useEffect(() => {
        console.log('%c StateSetupProvider::UPDATE', 'color: #18a4bf', { path, asyncReducer });
    });

    if (isAppReady === null) {
        return <h1>{ 'APP IS NOT READY' }</h1>;
    }

    if (typeof isAppReady === 'string') {
        return (
            <Navigate
                to={ isAppReady }
                state={{ redirected: true }}
            />
        );
    }
    return children;

    // if (isAppReady) {
    // }
};

export default StateSetupProvider;
