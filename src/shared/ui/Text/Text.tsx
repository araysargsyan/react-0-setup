import { type FC, memo } from 'react';
import _c from 'shared/helpers/classNames';

import cls from './Text.module.scss';


enum EAppTextTheme {
    PRIMARY = 'primary',
    ERROR = 'error',
}

enum EAppTextAlign {
    RIGHT = 'right',
    LEFT = 'left',
    CENTER = 'center',
}

enum EAppTextSize {
    M = 'size-m',
    L = 'size-l',
}

interface ITextProps {
    className?: string;
    title?: string;
    text?: string;
    theme?: EAppTextTheme;
    align?: EAppTextAlign;
    size?: EAppTextSize;
}

const AppText: FC<ITextProps> = ({
    className,
    text,
    title,
    theme = EAppTextTheme.PRIMARY,
    align = EAppTextAlign.LEFT,
    size = EAppTextSize.M,
}) => {
    return (
        <div className={ _c(cls.Text, [ className ], {
            [cls[theme]]: true,
            [cls[align]]: true,
            [cls[size]]: true,
        }) }
        >
            { title && <p className={ cls.title }>{ title }</p> }
            { text && <p className={ cls.text }>{ text }</p> }
        </div>
    );
};

export {
    EAppTextTheme,
    EAppTextAlign,
    EAppTextSize
};
export default memo(AppText);
