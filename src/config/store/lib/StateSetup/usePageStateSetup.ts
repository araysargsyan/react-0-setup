import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { type Location } from 'history';

import { type TStateSetup } from './types';



const usePageStateSetup = (stateSetup: TStateSetup) => {
    const dispatch = useDispatch();
    const setup = useMemo(() => bindActionCreators(stateSetup, dispatch), [ dispatch, stateSetup ]);
    const { pathname, state: historyState  }: Location<{from?: string} | null> = useLocation();
    const [ searchParams ] = useSearchParams();

    useEffect(() => {
        if (!historyState?.from) {
            console.log(
                '%c usePageStateSetUp: watcher on change pathname', 'color: #ae54bf',
                { historyState, pathname }
            );
            setup({ pathname, searchParams });
        }
        if (historyState?.from !== undefined) {
            delete historyState?.from;
            window.history.replaceState({ ...historyState }, document.title);
        }
    });

    console.log(
        `%c HOOK:usePageStateSetUp: redirected from ${historyState?.from}`, 'color: #18a4bf',
        { historyState, pathname }
    );
    return pathname;
};

export default usePageStateSetup;
