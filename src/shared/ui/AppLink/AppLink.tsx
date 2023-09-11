import {
    type FC, memo, type PropsWithChildren 
} from 'react';
import _c from 'shared/helpers/classNames';
import { Link, type LinkProps } from 'react-router-dom';
// import { useActions, useAppLocation } from 'shared/hooks/redux';
// import { appActionCreators } from 'store/app';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
// import { type IHistoryState } from 'shared/types';

import cls from './AppLink.module.scss';


export enum EAppLinkTheme {
    PRIMARY = 'primary',
    SECONDARY = 'secondary'
}

interface IAppLinkProps extends LinkProps {
    className?: string;
    theme?: EAppLinkTheme;
}
const AppLink: FC<PropsWithChildren<IAppLinkProps>> = ({
    className,
    to,
    children,
    theme = EAppLinkTheme.PRIMARY,
    ...otherProps
}) => {
    //const { setIsAppReady } = useActions(appActionCreators, [ 'setIsAppReady' ]);
    //const { pathname, state = {} } = useAppLocation();
    // const pathname = window.location.pathname;
    // const initialHistoryState = window.history.state.usr || {};
    // const historyState: IHistoryState = pathname === to
    //     ? { initialHistoryState }
    //     : { ...initialHistoryState, from: window.location.pathname };

    useRenderWatcher(AppLink.name/*, JSON.stringify({ historyState, pathname })*/);
    return (
        <Link
            //state={ pathname === to ? { from: null } : null }
            className={ _c(cls['app-link'], [ className, cls[theme] ]) }
            to={ to }
            //onClick={ () => setIsAppReady(false) }
            { ...otherProps }
        >
            { children }
        </Link>
    );
};

export default memo(AppLink);
