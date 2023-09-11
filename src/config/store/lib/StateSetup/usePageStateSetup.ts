import {
    useAppDispatch, useAppLocation, useAppNavigate, useAppSelector
} from 'shared/hooks/redux';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { bindActionCreators } from '@reduxjs/toolkit';
import { type TStateSetup } from 'config/store/lib/StateSetup/types';


const usePageStateSetup = (stateSetup: TStateSetup) => {
    const dispatch = useAppDispatch();
    const setup = useMemo(() => bindActionCreators(stateSetup, dispatch), [ dispatch, stateSetup ]);
    const { pathname, state: historyState  } = useAppLocation();
    const [ searchParams ] = useSearchParams();
    console.log(66666, historyState);

    useEffect(() => {
        console.log('+++++++++++++++++', pathname);
        console.log('+++++++++++++++++', historyState?.from);

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

    useRenderWatcher('usePageStateSetUp', `redirected from ${historyState?.from}`, 'HOOK');
    return pathname;
};

export default usePageStateSetup;
