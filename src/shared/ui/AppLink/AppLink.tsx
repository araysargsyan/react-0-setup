import {
    type FC, memo, type PropsWithChildren 
} from 'react';
import _c from 'shared/helpers/classNames';
import  { type LinkProps, Link } from 'react-router-dom';

import cls from './AppLink.module.scss';

 
export enum EAppLinkTheme {
    PRYMARY = 'prymary',
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
    theme = EAppLinkTheme.PRYMARY,
    ...otherProps
}) => {
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
