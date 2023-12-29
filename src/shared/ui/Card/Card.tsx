import {
    type FC, type HTMLAttributes, memo, type ReactNode
} from 'react';
import _c from 'shared/helpers/classNames';

import cls from './Card.module.scss';


enum ECardTheme {
    NORMAL = 'normal',
    OUTLINED = 'outlined',
}

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: ReactNode;
    theme?: ECardTheme;
}

const Card: FC<ICardProps> = ({
    children,
    className,
    theme = ECardTheme.NORMAL,
    ...otherProps
}) => {
    return (
        <div
            className={ _c(cls.card, [ className, cls[theme] ]) }
            { ...otherProps }
        >
            { children }
        </div>
    );
};

export { ECardTheme };
export default memo(Card);
