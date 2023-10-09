import {
    type FC,
    type PropsWithChildren, type ReactNode,
    useEffect, useState
} from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from 'shared/ui/Modal';
import Portal from 'shared/ui/Portal';

import {
    type IStateSchema,
    type TAsyncReducer,
    type TCheckAuthorizationAsyncThunk,
    type TStateSetup
} from './types';
import usePageStateSetup from './usePageStateSetup';


const StateSetupProvider: FC<PropsWithChildren<{
    setUp: TStateSetup;
    checkAuthorization: TCheckAuthorizationAsyncThunk;
    asyncReducer?: TAsyncReducer;
    RedirectionModal?: FC<{
        show: boolean;
        context: {
            redirectTo: string | null;
            from: string;
        };
    }>;
}>> = ({
    children,
    setUp,
    checkAuthorization,
    asyncReducer,
    RedirectionModal
}) => {
    // const isAppReady = useSelector(({ app }: IStateSchema) => app.isAppReady);
    const {
        redirectRef, pathname, from 
    } = usePageStateSetup(setUp, checkAuthorization, asyncReducer);

    useEffect(() => {
        console.log('%c StateSetupProvider::UPDATE', 'color: #a90d38', {
            redirectTo: redirectRef.current, pathname, asyncReducer
        });
    });
    // if (!isAppReady) {
    //     return null;
    //     // return <h1>{ 'APP IS NOT READY' }</h1>;
    // }
    //
    // if (redirectRef.current) {
    //     const navigateTo = redirectRef.current;
    //     redirectRef.current = null;
    //
    //     return (
    //         <Navigate
    //             to={ navigateTo }
    //             state={{ redirected: true }}
    //         />
    //     );
    // }

    //! if not null
    return (
        <>
            { RedirectionModal ? (
                <RedirectionModal
                    show={ Boolean(redirectRef.current) }
                    context={{
                        redirectTo: redirectRef.current,
                        from: from
                    }}
                />
            ) : null }
            { children }
        </>
    );
};

export default StateSetupProvider;
