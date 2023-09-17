import { useLocation, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { type AnyAction, type ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { type Location } from 'history';

import {
    type IStateSchema, type TAsyncReducer, type TCheckAuthorizationAsyncThunk, type TStateSetup
} from './types';



const usePageStateSetup = (
    stateSetup: TStateSetup,
    checkAuthorization: TCheckAuthorizationAsyncThunk,
    asyncReducer?: TAsyncReducer
) => {
    const isAppReady = useSelector(({ app }: IStateSchema) => app.isAppReady);

    const dispatch = useDispatch<ThunkDispatch<IStateSchema, unknown, AnyAction>>();
    const setup = useCallback(
        (...args: Parameters<TStateSetup>) => dispatch(stateSetup(...args)),
        [ dispatch, stateSetup ]
    );
    const checkAuth = useCallback(
        (...args: Parameters<TCheckAuthorizationAsyncThunk>) => dispatch(checkAuthorization(...args)),
        [ dispatch, checkAuthorization ]
    );

    const { pathname, state: historyState }: Location<{redirected?: boolean} | null> = useLocation();
    const [ searchParams ] = useSearchParams();

    useEffect(() => {
        if (isAppReady === null) {
            checkAuth({ pathname, searchParams });
        }

        if (isAppReady === false || (typeof isAppReady === 'string' && historyState?.redirected)) {
            console.log(
                '%c usePageStateSetUp: watcher on change pathname', 'color: #ae54bf',
                {
                    historyState: { ...historyState },
                    pathname,
                    redirected: historyState?.redirected,
                    isAppReady
                }
            );
            setup({ pathname, asyncReducer });
        }
        if (historyState && isAppReady) {
            delete historyState?.redirected;
            window.history.replaceState({ ...historyState }, document.title);
        }
    });

    return pathname;
};

export default usePageStateSetup;
