import {
    type FC,
    type PropsWithChildren,
    memo,
} from 'react';
import _c from 'shared/helpers/classNames';
import { Link, type LinkProps } from 'react-router-dom';
import useRenderWatcher from 'shared/hooks/useRenderWatcher';

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

    useRenderWatcher(AppLink.name/*, JSON.stringify({ historyState, pathname })*/);
    return (
        <Link
            className={ _c(cls['app-link'], [ className, cls[theme] ]) }
            to={ to }
            { ...otherProps }
        >
            { children }
        </Link>
    );
};

export default memo(AppLink);
