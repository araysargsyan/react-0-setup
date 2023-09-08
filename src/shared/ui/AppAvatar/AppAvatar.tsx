import {
    type CSSProperties, type FC, useMemo 
} from 'react';
import _c from 'shared/helpers/classNames';
import { type IStateSchema } from 'config/store';
import { useSelector } from 'react-redux';

import cls from './AppAvatar.module.scss';


interface IAppAvatarProps {
    className?: string;
    srcSelector: (state: IStateSchema) => string;
    src?: string;
    size?: number;
    alt?: string;
}

const AppAvatar: FC<IAppAvatarProps> = ({
    className,
    src,
    srcSelector,
    size,
    alt,
}) => {
    const srcValue = src
        ? src
        : srcSelector
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useSelector<IStateSchema, string | undefined>(srcSelector) || ''
            : '';

    const styles = useMemo<CSSProperties>(() => ({
        width: size || 100,
        height: size || 100,
    }), [ size ]);

    if (!srcValue) {
        return null;
    }

    return (
        <div className={ cls['app-avatar-wrapper'] }>
            <img
                src={ srcValue }
                alt={ alt }
                style={ styles }
                className={ _c(cls['app-avatar'], [ className ]) }
            />
        </div>
    );
};

export default AppAvatar;
