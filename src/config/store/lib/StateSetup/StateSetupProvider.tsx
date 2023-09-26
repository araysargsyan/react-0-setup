import {
    type FC,
    type PropsWithChildren,
    useEffect
} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from 'shared/hooks/redux';
import { type Location } from 'history';

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
    const { redirectRef, pathname } = usePageStateSetup(setUp, checkAuthorization, asyncReducer);
    const isAppReady = useAppSelector(({ app }) => app.isAppReady);

    useEffect(() => {
        console.log('%c StateSetupProvider::UPDATE', 'color: #a90d38', {
            redirectTo: redirectRef.current, isAppReady, pathname, asyncReducer
        });
    });

    if (isAppReady === null) {
        return <h1>{ 'APP IS NOT READY' }</h1>;
    }

    if (redirectRef.current) {
        const navigateTo = redirectRef.current;
        redirectRef.current = null;

        return (
            <Navigate
                to={ /*isAppReady*/ navigateTo }
                state={{ redirected: true }}
            />
        );
    }

    //! if not null
    return children;
};

export default StateSetupProvider;
