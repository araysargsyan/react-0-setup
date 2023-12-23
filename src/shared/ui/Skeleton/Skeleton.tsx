import {
    memo,
    type CSSProperties,
    type FC
} from 'react';
import _c from 'shared/helpers/classNames';

import cls from './Skeleton.module.scss';


interface ISkeletonProps {
    className?: string;
    height?: string | number;
    maxWidth?: string | number;
    border?: string;
}

const Skeleton: FC<ISkeletonProps> =({
    className,
    height,
    maxWidth,
    border,
}) => {
    const styles: CSSProperties = {
        maxWidth,
        height,
        borderRadius: border,
    };

    return (
        <p
            className={ _c(cls.skeleton,  [ className ]) }
            style={ styles }
        />
    );
};

export default memo(Skeleton);
