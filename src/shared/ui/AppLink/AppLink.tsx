import { FC, PropsWithChildren } from 'react';
import classNames from 'helpers/classNames';
import { Link, LinkProps } from 'react-router-dom';

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
            className={ classNames(cls['app-link'], [ className, cls[theme] ]) }
            to={ to }
            { ...otherProps }
        >
            { children }
        </Link>
    );
};

export default AppLink;
