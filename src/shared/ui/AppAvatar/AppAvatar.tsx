import { type FC } from 'react';
import _c from 'shared/helpers/classNames';
import { type IStateSchema } from 'config/store';
import { useSelector } from 'react-redux';

import cls from './AppAvatar.module.scss';


interface IAppAvatarProps {
    className?: string;
    size?: number;
    alt?: string;
    src?: string;
    srcSelector?: (state: IStateSchema) => string;
}

const AppAvatar: FC<IAppAvatarProps> = ({
    className,
    size = 100,
    alt,
    src,
    srcSelector
}) => {
    const srcValue = src
        ? src
        : srcSelector
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useSelector<IStateSchema, string | undefined>(srcSelector) || ''
            : '';

    if (!srcValue) {
        return null;
    }

    return (
        <div
            className={ cls['app-avatar-wrapper'] }
            // style={{ maxWidth: size }}
        >
            <img
                width={ `${size}px` }
                height={ `${size}px` }
                src={ srcValue }
                alt={ alt }
                className={ _c(cls['app-avatar'], [ className ]) }
            />
        </div>
    );
};

export default AppAvatar;
