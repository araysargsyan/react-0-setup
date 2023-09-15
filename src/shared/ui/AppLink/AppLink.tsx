import {
    type FC, memo, type PropsWithChildren 
} from 'react';
import _c from 'shared/helpers/classNames';
import { Link, type LinkProps } from 'react-router-dom';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';
import { useActions } from 'shared/hooks/redux';
import { appActionCreators } from 'store/app';

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
    const { setIsPageReady } = useActions(appActionCreators, [ 'setIsPageReady' ]);
    //const { pathname, state = {} } = useAppLocation();
    // const pathname = window.location.pathname;
    // const initialHistoryState = window.history.state.usr || {};
    // const historyState: IHistoryState = pathname === to
    //     ? { initialHistoryState, from: null }
    //     : { ...initialHistoryState, from: window.location.pathname };

    useRenderWatcher(AppLink.name/*, JSON.stringify({ historyState, pathname })*/);
    return (
        <Link
            //state={ historyState }
            // state={{ from: pathname === to ? null : pathname }}
            className={ _c(cls['app-link'], [ className, cls[theme] ]) }
            to={ to }
            //onClick={ () => setIsAppReady(null) }
            onClick={ () => setIsPageReady(null) }
            { ...otherProps }
        >
            { children }
        </Link>
    );
};

export default memo(AppLink);
