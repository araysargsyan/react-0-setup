import { type FC, memo } from 'react';
import _c from 'shared/helpers/classNames';

import cls from './Text.module.scss';


export enum ETextTheme {
    PRIMARY = 'primary',
    ERROR = 'error',
}

export enum ETextAlign {
    RIGHT = 'right',
    LEFT = 'left',
    CENTER = 'center',
}

interface ITextProps {
    className?: string;
    title?: string;
    text?: string;
    theme?: ETextTheme;
    align?: ETextAlign;
}

const AppText: FC<ITextProps> = ({
    className,
    text,
    title,
    theme = ETextTheme.PRIMARY,
    align = ETextAlign.LEFT,
}) => {
    return (
        <div className={ _c(cls.Text, [ className ], { [cls[theme]]: true, [cls[align]]: true }) }>
            { title && <p className={ cls.title }>{ title }</p> }
            { text && <p className={ cls.text }>{ text }</p> }
        </div>
    );
};

export default memo(AppText);
